export interface WebRTCEventHandlers {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onIceCandidate?: (candidate: RTCIceCandidate) => void;
    onRenegotiationNeeded?: (offer: RTCSessionDescriptionInit) => void;
    onError?: (error: Error) => void;
}

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private handlers: WebRTCEventHandlers = {};
    private isInitiator: boolean = false;
    private iceCandidatesQueue: RTCIceCandidateInit[] = [];
    private isConnectionEstablished: boolean = false;

    // STUN servers for NAT traversal
    private readonly iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ];

    /**
     * Set event handlers
     */
    setEventHandlers(handlers: WebRTCEventHandlers) {
        this.handlers = { ...this.handlers, ...handlers };
    }

    /**
     * Initialize peer connection
     */
    private initializePeerConnection() {
        if (this.peerConnection) {
            this.peerConnection.close();
        }

        this.peerConnection = new RTCPeerConnection({
            iceServers: this.iceServers,
        });

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Generated ICE candidate:', event.candidate);
                this.handlers.onIceCandidate?.(event.candidate);
            }
        };

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            console.log('Received remote stream:', event.streams[0]);
            this.remoteStream = event.streams[0];
            this.handlers.onRemoteStream?.(event.streams[0]);
        };

        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection?.connectionState;
            console.log('WebRTC connection state:', state);
            if (state) {
                this.handlers.onConnectionStateChange?.(state);
            }
        };

        // Handle ICE connection state changes
        this.peerConnection.oniceconnectionstatechange = () => {
            const state = this.peerConnection?.iceConnectionState;
            console.log('ICE connection state:', state);

            // Mark connection as established when ICE connection is stable
            if (state === 'connected' || state === 'completed') {
                this.isConnectionEstablished = true;
                console.log(
                    'Connection established - renegotiation now allowed'
                );
            } else if (
                state === 'failed' ||
                state === 'disconnected' ||
                state === 'closed'
            ) {
                this.isConnectionEstablished = false;
            }
        };

        // Handle renegotiation when tracks are added/removed
        this.peerConnection.onnegotiationneeded = async () => {
            // Only allow renegotiation after initial connection is established
            if (!this.isConnectionEstablished) {
                console.log(
                    'Skipping renegotiation - connection not yet established'
                );
                return;
            }

            console.log('Negotiation needed - creating new offer');
            try {
                const offer = await this.peerConnection!.createOffer();
                await this.peerConnection!.setLocalDescription(offer);

                // Trigger renegotiation through new handler
                if (this.handlers.onRenegotiationNeeded) {
                    this.handlers.onRenegotiationNeeded(offer);
                }
            } catch (error) {
                console.error('Error during renegotiation:', error);
            }
        };

        console.log('Peer connection initialized');
    }

    /**
     * Get user media (camera and microphone)
     */
    async getUserMedia(constraints: {
        video?: boolean | MediaTrackConstraints;
        audio?: boolean | MediaTrackConstraints;
    }): Promise<MediaStream> {
        try {
            console.log('Requesting user media with constraints:', constraints);

            const stream =
                await navigator.mediaDevices.getUserMedia(constraints);
            this.localStream = stream;

            console.log('Got user media:', stream);
            this.handlers.onLocalStream?.(stream);

            return stream;
        } catch (error) {
            console.error('Error getting user media:', error);
            this.handlers.onError?.(error as Error);
            throw error;
        }
    }

    /**
     * Add local stream to peer connection
     */
    addLocalStream(stream: MediaStream) {
        if (!this.peerConnection) {
            this.initializePeerConnection();
        }

        if (this.peerConnection && stream) {
            console.log('Adding local stream to peer connection');

            // Get currently added tracks to avoid duplicates
            const senders = this.peerConnection.getSenders();
            const existingTracks = senders
                .map((sender) => sender.track)
                .filter(Boolean);

            stream.getTracks().forEach((track) => {
                // Only add track if it's not already added
                if (!existingTracks.includes(track)) {
                    console.log('Adding new track:', track.kind);
                    this.peerConnection!.addTrack(track, stream);
                } else {
                    console.log('Track already exists, skipping:', track.kind);
                }
            });
        }
    }

    /**
     * Create and send offer (for call initiator)
     */
    async createOffer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            this.initializePeerConnection();
        }

        try {
            this.isInitiator = true;
            console.log('Creating WebRTC offer...');

            const offer = await this.peerConnection!.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            });

            await this.peerConnection!.setLocalDescription(offer);
            console.log('Local description set (offer):', offer);

            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            this.handlers.onError?.(error as Error);
            throw error;
        }
    }

    /**
     * Handle received offer and create answer
     */
    async handleOffer(
        offer: RTCSessionDescriptionInit
    ): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            this.initializePeerConnection();
        }

        try {
            this.isInitiator = false;
            console.log('Handling WebRTC offer:', offer);

            await this.peerConnection!.setRemoteDescription(offer);
            console.log('Remote description set (offer)');

            // Process queued ICE candidates
            await this.processQueuedIceCandidates();

            const answer = await this.peerConnection!.createAnswer();
            await this.peerConnection!.setLocalDescription(answer);

            console.log('Local description set (answer):', answer);
            return answer;
        } catch (error) {
            console.error('Error handling offer:', error);
            this.handlers.onError?.(error as Error);
            throw error;
        }
    }

    /**
     * Handle received answer
     */
    async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.peerConnection) {
            console.error('No peer connection available');
            return;
        }

        try {
            console.log('Handling WebRTC answer:', answer);
            await this.peerConnection.setRemoteDescription(answer);
            console.log('Remote description set (answer)');

            // Process queued ICE candidates
            await this.processQueuedIceCandidates();
        } catch (error) {
            console.error('Error handling answer:', error);
            this.handlers.onError?.(error as Error);
            throw error;
        }
    }

    /**
     * Add ICE candidate
     */
    async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
        if (!this.peerConnection) {
            console.warn('No peer connection, queueing ICE candidate');
            this.iceCandidatesQueue.push(candidate);
            return;
        }

        // If remote description is not set yet, queue the candidate
        if (!this.peerConnection.remoteDescription) {
            console.log('Queueing ICE candidate (no remote description yet)');
            this.iceCandidatesQueue.push(candidate);
            return;
        }

        try {
            await this.peerConnection.addIceCandidate(candidate);
            console.log('Added ICE candidate');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            // Don't throw error for ICE candidate failures
        }
    }

    /**
     * Process queued ICE candidates
     */
    private async processQueuedIceCandidates(): Promise<void> {
        if (!this.peerConnection || this.iceCandidatesQueue.length === 0) {
            return;
        }

        console.log(
            `Processing ${this.iceCandidatesQueue.length} queued ICE candidates`
        );

        const candidates = [...this.iceCandidatesQueue];
        this.iceCandidatesQueue = [];

        for (const candidate of candidates) {
            try {
                await this.peerConnection.addIceCandidate(candidate);
                console.log('Added queued ICE candidate');
            } catch (error) {
                console.error('Error adding queued ICE candidate:', error);
            }
        }
    }

    /**
     * Toggle video track
     */
    toggleVideo(enabled: boolean): void {
        if (!this.localStream) {
            console.warn('No local stream available');
            return;
        }

        const videoTracks = this.localStream.getVideoTracks();
        videoTracks.forEach((track) => {
            track.enabled = enabled;
        });

        console.log(`Video ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Toggle audio track
     */
    toggleAudio(enabled: boolean): void {
        if (!this.localStream) {
            console.warn('No local stream available');
            return;
        }

        const audioTracks = this.localStream.getAudioTracks();
        audioTracks.forEach((track) => {
            track.enabled = enabled;
        });

        console.log(`Audio ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Add video track to existing stream
     */
    async addVideoTrack(): Promise<void> {
        if (!this.localStream || !this.peerConnection) {
            console.warn('No local stream or peer connection available');
            return;
        }

        try {
            // Check if video track already exists
            const videoTracks = this.localStream.getVideoTracks();
            if (videoTracks.length > 0) {
                console.log('Video track already exists');
                return;
            }

            // Request video stream
            const videoStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false,
            });

            const videoTrack = videoStream.getVideoTracks()[0];
            if (videoTrack) {
                // Add to local stream
                this.localStream.addTrack(videoTrack);

                // Add to peer connection
                this.peerConnection.addTrack(videoTrack, this.localStream);

                console.log('Video track added');
                this.handlers.onLocalStream?.(this.localStream);
            }
        } catch (error) {
            console.error('Error adding video track:', error);
            this.handlers.onError?.(error as Error);
            throw error;
        }
    }

    /**
     * Remove video track from stream
     */
    removeVideoTrack(): void {
        if (!this.localStream) {
            console.warn('No local stream available');
            return;
        }

        const videoTracks = this.localStream.getVideoTracks();
        videoTracks.forEach((track) => {
            this.localStream!.removeTrack(track);
            track.stop();
        });

        console.log('Video track removed');
        this.handlers.onLocalStream?.(this.localStream);
    }

    /**
     * Get current connection state
     */
    getConnectionState(): RTCPeerConnectionState | null {
        return this.peerConnection?.connectionState ?? null;
    }

    /**
     * Get local stream
     */
    getLocalStream(): MediaStream | null {
        return this.localStream;
    }

    /**
     * Get remote stream
     */
    getRemoteStream(): MediaStream | null {
        return this.remoteStream;
    }

    /**
     * Check if peer connection is established
     */
    isConnected(): boolean {
        return this.peerConnection?.connectionState === 'connected';
    }

    /**
     * Close peer connection and cleanup
     */
    cleanup(): void {
        console.log('Cleaning up WebRTC resources...');

        // Stop local stream tracks
        if (this.localStream) {
            console.log('Stopping local stream tracks...');
            this.localStream.getTracks().forEach((track) => {
                console.log(
                    `Stopping local track: ${track.kind} - ${track.label} - readyState: ${track.readyState}`
                );
                track.stop();
            });
            this.localStream = null;
        }

        // Stop remote stream tracks (if any)
        if (this.remoteStream) {
            console.log('Stopping remote stream tracks...');
            this.remoteStream.getTracks().forEach((track) => {
                console.log(
                    `Stopping remote track: ${track.kind} - ${track.label} - readyState: ${track.readyState}`
                );
                track.stop();
            });
            this.remoteStream = null;
        }

        // Close peer connection
        if (this.peerConnection) {
            console.log('Closing peer connection...');
            this.peerConnection.close();
            this.peerConnection = null;
        }

        // Clear queued candidates
        this.iceCandidatesQueue = [];

        // Reset state
        this.isInitiator = false;
        this.isConnectionEstablished = false;

        console.log('WebRTC cleanup completed');
    }
}

export const webRTCService = new WebRTCService();
export default WebRTCService;
