export interface WebRTCEventHandlers {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onIceCandidate?: (candidate: RTCIceCandidate) => void;
    onRenegotiationNeeded?: (offer: RTCSessionDescriptionInit) => void;
    onError?: (error: Error) => void;
}

export interface WebRTCEventHandlers {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onIceCandidate?: (candidate: RTCIceCandidate) => void;
    onRenegotiationNeeded?: (offer: RTCSessionDescriptionInit) => void;
    onError?: (error: Error) => void;
    onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
}

interface ICEServerConfig {
    urls: string | string[];
    username?: string;
    credential?: string;
}

const TURN_USERNAME = process.env.NEXT_PUBLIC_TURN_USERNAME;
const TURN_CREDENTIAL = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private handlers: WebRTCEventHandlers = {};
    private isInitiator: boolean = false;
    private iceCandidatesQueue: RTCIceCandidateInit[] = [];
    private isConnectionEstablished: boolean = false;
    private connectionTimeout: NodeJS.Timeout | null = null;
    private retryAttempts: number = 0;
    private maxRetryAttempts: number = 3;

    // Improved ICE servers with TURN support
    private iceServers: ICEServerConfig[] = [
        // Multiple STUN servers for better reliability
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' },

        // Metered TURN (free tier available)
        {
            urls: 'stun:stun.relay.metered.ca:80',
        },
        {
            urls: 'turn:global.relay.metered.ca:80',
            username: TURN_USERNAME,
            credential: TURN_CREDENTIAL,
        },
        {
            urls: 'turn:global.relay.metered.ca:80?transport=tcp',
            username: TURN_USERNAME,
            credential: TURN_CREDENTIAL,
        },
        {
            urls: 'turn:global.relay.metered.ca:443',
            username: TURN_USERNAME,
            credential: TURN_CREDENTIAL,
        },
        {
            urls: 'turns:global.relay.metered.ca:443?transport=tcp',
            username: TURN_USERNAME,
            credential: TURN_CREDENTIAL,
        },
    ];

    /**
     * Set custom ICE servers (useful for dynamic configuration)
     */
    setIceServers(servers: ICEServerConfig[]) {
        this.iceServers = servers;
    }

    /**
     * Fetch ICE servers from backend
     */
    async fetchIceServers(): Promise<ICEServerConfig[]> {
        try {
            const response = await fetch('/api/ice-servers');
            const data = await response.json();
            return data.iceServers || this.iceServers;
        } catch (error) {
            console.warn(
                'Failed to fetch ICE servers from backend, using defaults'
            );
            return this.iceServers;
        }
    }

    /**
     * Set event handlers
     */
    setEventHandlers(handlers: WebRTCEventHandlers) {
        this.handlers = { ...this.handlers, ...handlers };
    }

    /**
     * Initialize peer connection with improved configuration
     */
    private async initializePeerConnection() {
        if (this.peerConnection) {
            this.peerConnection.close();
        }

        // Fetch latest ICE servers
        const iceServers = await this.fetchIceServers();

        this.peerConnection = new RTCPeerConnection({
            iceServers: iceServers,
            iceCandidatePoolSize: 10, // Pre-gather candidates
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require',
            iceTransportPolicy: 'all', // Allow both STUN and TURN
        });

        // Enhanced ICE candidate handling
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Generated ICE candidate:', {
                    type: event.candidate.type,
                    protocol: event.candidate.protocol,
                    address: event.candidate.address,
                    port: event.candidate.port,
                });
                this.handlers.onIceCandidate?.(event.candidate);
            } else {
                console.log('All ICE candidates have been sent');
            }
        };

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            console.log('Received remote stream:', event.streams[0]);
            this.remoteStream = event.streams[0];
            this.handlers.onRemoteStream?.(event.streams[0]);
        };

        // Enhanced connection state monitoring
        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection?.connectionState;
            console.log('WebRTC connection state:', state);

            if (state === 'connected') {
                this.clearConnectionTimeout();
                this.retryAttempts = 0;
            } else if (state === 'failed') {
                this.handleConnectionFailure();
            }

            if (state) {
                this.handlers.onConnectionStateChange?.(state);
            }
        };

        // Enhanced ICE connection state monitoring
        this.peerConnection.oniceconnectionstatechange = () => {
            const state = this.peerConnection?.iceConnectionState;
            console.log('ICE connection state:', state);

            if (state === 'connected' || state === 'completed') {
                this.isConnectionEstablished = true;
                this.clearConnectionTimeout();
                console.log(
                    'Connection established - renegotiation now allowed'
                );
            } else if (state === 'failed') {
                console.error('ICE connection failed');
                this.handleConnectionFailure();
            } else if (state === 'disconnected') {
                console.warn('ICE connection disconnected, attempting restart');
                this.restartIce();
            } else if (state === 'closed') {
                this.isConnectionEstablished = false;
            }

            if (state) {
                this.handlers.onIceConnectionStateChange?.(state);
            }
        };

        // Handle renegotiation
        this.peerConnection.onnegotiationneeded = async () => {
            if (!this.isConnectionEstablished && this.retryAttempts === 0) {
                console.log(
                    'Skipping renegotiation - initial connection in progress'
                );
                return;
            }

            console.log('Negotiation needed - creating new offer');
            try {
                const offer = await this.peerConnection!.createOffer();
                await this.peerConnection!.setLocalDescription(offer);

                if (this.handlers.onRenegotiationNeeded) {
                    this.handlers.onRenegotiationNeeded(offer);
                }
            } catch (error) {
                console.error('Error during renegotiation:', error);
                this.handlers.onError?.(error as Error);
            }
        };

        // Set connection timeout
        this.setConnectionTimeout();

        console.log('Peer connection initialized with enhanced configuration');
    }

    /**
     * Set connection timeout to handle hanging connections
     */
    private setConnectionTimeout() {
        this.clearConnectionTimeout();

        this.connectionTimeout = setTimeout(() => {
            if (
                this.peerConnection?.iceConnectionState !== 'connected' &&
                this.peerConnection?.iceConnectionState !== 'completed'
            ) {
                console.warn('Connection timeout - attempting retry');
                this.handleConnectionFailure();
            }
        }, 30000); // 30 second timeout
    }

    /**
     * Clear connection timeout
     */
    private clearConnectionTimeout() {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }
    }

    /**
     * Restart ICE gathering
     */
    private async restartIce() {
        if (!this.peerConnection) return;

        try {
            console.log('Restarting ICE gathering...');
            await this.peerConnection.restartIce();
        } catch (error) {
            console.error('Error restarting ICE:', error);
        }
    }

    /**
     * Get user media with fallback options
     */
    async getUserMedia(constraints: {
        video?: boolean | MediaTrackConstraints;
        audio?: boolean | MediaTrackConstraints;
    }): Promise<MediaStream> {
        try {
            console.log('Requesting user media with constraints:', constraints);

            // Try with ideal constraints first
            const idealConstraints = {
                video: constraints.video
                    ? {
                          width: { ideal: 1280, max: 1920 },
                          height: { ideal: 720, max: 1080 },
                          frameRate: { ideal: 30, max: 60 },
                          facingMode: 'user',
                      }
                    : false,
                audio: constraints.audio
                    ? {
                          echoCancellation: true,
                          noiseSuppression: true,
                          autoGainControl: true,
                          sampleRate: { ideal: 48000 },
                      }
                    : false,
            };

            let stream: MediaStream;

            try {
                stream =
                    await navigator.mediaDevices.getUserMedia(idealConstraints);
            } catch (error) {
                console.warn(
                    'Failed with ideal constraints, trying fallback...'
                );

                // Fallback to basic constraints
                const fallbackConstraints = {
                    video: constraints.video
                        ? { width: 640, height: 480 }
                        : false,
                    audio: constraints.audio || false,
                };

                stream =
                    await navigator.mediaDevices.getUserMedia(
                        fallbackConstraints
                    );
            }

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
    async addLocalStream(stream: MediaStream) {
        if (!this.peerConnection) {
            await this.initializePeerConnection();
        }

        if (this.peerConnection && stream) {
            console.log('Adding local stream to peer connection');

            // Remove existing senders to avoid duplicates
            const senders = this.peerConnection.getSenders();
            await Promise.all(
                senders.map((sender) => {
                    if (sender.track) {
                        return this.peerConnection!.removeTrack(sender);
                    }
                    return Promise.resolve();
                })
            );

            // Add new tracks
            stream.getTracks().forEach((track) => {
                console.log('Adding track:', track.kind, track.label);
                this.peerConnection!.addTrack(track, stream);
            });
        }
    }

    /**
     * Create and send offer with retry logic
     */
    async createOffer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            await this.initializePeerConnection();
        }

        try {
            this.isInitiator = true;
            console.log('Creating WebRTC offer...');

            const offerOptions: RTCOfferOptions = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
                iceRestart: this.retryAttempts > 0, // Restart ICE on retry
            };

            const offer = await this.peerConnection!.createOffer(offerOptions);
            await this.peerConnection!.setLocalDescription(offer);

            console.log('Local description set (offer):', {
                type: offer.type,
                hasVideo: offer.sdp?.includes('m=video'),
                hasAudio: offer.sdp?.includes('m=audio'),
            });

            this.setConnectionTimeout();
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
            await this.initializePeerConnection();
        }

        try {
            this.isInitiator = false;
            console.log('Handling WebRTC offer...');

            await this.peerConnection!.setRemoteDescription(offer);
            console.log('Remote description set (offer)');

            // Process queued ICE candidates
            await this.processQueuedIceCandidates();

            const answerOptions: RTCAnswerOptions = {
                voiceActivityDetection: false,
            };

            const answer =
                await this.peerConnection!.createAnswer(answerOptions);
            await this.peerConnection!.setLocalDescription(answer);

            console.log('Local description set (answer):', {
                type: answer.type,
                hasVideo: answer.sdp?.includes('m=video'),
                hasAudio: answer.sdp?.includes('m=audio'),
            });

            this.setConnectionTimeout();
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
            console.log('Handling WebRTC answer...');
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
     * Enhanced ICE candidate handling with validation
     */
    async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
        // Validate candidate
        if (!candidate || !candidate.candidate) {
            console.warn('Invalid ICE candidate received');
            return;
        }

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
            console.log('Added ICE candidate:', {
                type: candidate.candidate?.split(' ')[7], // candidate type
                protocol: candidate.candidate?.split(' ')[2], // protocol
            });
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            // Don't throw error for ICE candidate failures - continue with others
        }
    }

    /**
     * Process queued ICE candidates with better error handling
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
                // Continue with other candidates
            }
        }
    }

    /**
     * Check network connectivity and suggest solutions
     */
    async diagnoseConnection(): Promise<{
        canConnectToStun: boolean;
        canConnectToTurn: boolean;
        networkType: string;
        suggestions: string[];
    }> {
        const suggestions: string[] = [];
        let canConnectToStun = false;
        let canConnectToTurn = false;
        let networkType = 'unknown';

        try {
            // Test STUN connectivity
            const testPC = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });

            const testPromise = new Promise<boolean>((resolve) => {
                let candidateReceived = false;

                testPC.onicecandidate = (event) => {
                    if (event.candidate && !candidateReceived) {
                        candidateReceived = true;
                        canConnectToStun = true;

                        // Determine network type from candidate
                        const candidate = event.candidate.candidate;
                        if (candidate.includes('typ host')) {
                            networkType = 'Direct';
                        } else if (candidate.includes('typ srflx')) {
                            networkType = 'Behind NAT';
                        } else if (candidate.includes('typ relay')) {
                            networkType = 'Behind Symmetric NAT';
                        }

                        resolve(true);
                    }
                };

                // Create dummy offer to trigger ICE gathering
                testPC.createOffer().then((offer) => {
                    testPC.setLocalDescription(offer);
                });

                // Timeout after 5 seconds
                setTimeout(() => {
                    if (!candidateReceived) {
                        resolve(false);
                    }
                }, 5000);
            });

            await testPromise;
            testPC.close();
        } catch (error) {
            console.error('Error diagnosing connection:', error);
        }

        // Generate suggestions based on results
        if (!canConnectToStun) {
            suggestions.push(
                'STUN servers are blocked - check firewall settings'
            );
            suggestions.push('Try using different STUN servers');
        }

        if (networkType === 'Behind Symmetric NAT') {
            suggestions.push(
                'TURN server is required for this network configuration'
            );
            canConnectToTurn = false; // We'd need to test actual TURN
        }

        if (suggestions.length === 0) {
            suggestions.push('Network connectivity looks good');
        }

        return {
            canConnectToStun,
            canConnectToTurn,
            networkType,
            suggestions,
        };
    }

    /**
     * Handle connection failure with intelligent retry
     */
    private async handleConnectionFailure() {
        if (this.retryAttempts >= this.maxRetryAttempts) {
            console.error(
                'Max retry attempts reached, connection failed permanently'
            );

            // Run diagnosis to help with troubleshooting
            const diagnosis = await this.diagnoseConnection();
            const errorMessage = `Connection failed. Network type: ${diagnosis.networkType}. Suggestions: ${diagnosis.suggestions.join(', ')}`;

            this.handlers.onError?.(new Error(errorMessage));
            return;
        }

        this.retryAttempts++;
        console.log(
            `Connection failed, attempting retry ${this.retryAttempts}/${this.maxRetryAttempts}`
        );

        // Exponential backoff
        const delay = Math.min(
            1000 * Math.pow(2, this.retryAttempts - 1),
            10000
        );
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Reinitialize with fresh peer connection
        await this.initializePeerConnection();

        if (this.localStream) {
            await this.addLocalStream(this.localStream);
        }

        // If we're the initiator, create new offer
        if (this.isInitiator) {
            try {
                const offer = await this.createOffer();
                this.handlers.onRenegotiationNeeded?.(offer);
            } catch (error) {
                console.error('Error creating retry offer:', error);
            }
        }
    }

    /**
     * Toggle video track with renegotiation
     */
    async toggleVideo(enabled: boolean): Promise<void> {
        if (!this.localStream) {
            console.warn('No local stream available');
            return;
        }

        const videoTracks = this.localStream.getVideoTracks();

        if (enabled && videoTracks.length === 0) {
            // Add video track if not present
            await this.addVideoTrack();
        } else {
            // Toggle existing tracks
            videoTracks.forEach((track) => {
                track.enabled = enabled;
            });
        }

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
     * Add video track to existing stream with renegotiation
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
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                },
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
     * Get detailed connection stats for debugging
     */
    async getConnectionStats(): Promise<any> {
        if (!this.peerConnection) {
            return null;
        }

        try {
            const stats = await this.peerConnection.getStats();
            const statsReport: any = {};

            stats.forEach((report, id) => {
                if (
                    report.type === 'candidate-pair' &&
                    report.state === 'succeeded'
                ) {
                    statsReport.selectedCandidatePair = report;
                } else if (report.type === 'local-candidate') {
                    statsReport.localCandidate = report;
                } else if (report.type === 'remote-candidate') {
                    statsReport.remoteCandidate = report;
                }
            });

            return statsReport;
        } catch (error) {
            console.error('Error getting connection stats:', error);
            return null;
        }
    }

    /**
     * Get current connection state
     */
    getConnectionState(): RTCPeerConnectionState | null {
        return this.peerConnection?.connectionState ?? null;
    }

    /**
     * Get ICE connection state
     */
    getIceConnectionState(): RTCIceConnectionState | null {
        return this.peerConnection?.iceConnectionState ?? null;
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
        const connectionState = this.peerConnection?.connectionState;
        const iceState = this.peerConnection?.iceConnectionState;

        return (
            connectionState === 'connected' &&
            (iceState === 'connected' || iceState === 'completed')
        );
    }

    // THÊM HOẶC SỬA LẠI PHƯƠNG THỨC NÀY
    public cleanup() {
        console.log('WebRTCService: Cleaning up...');

        // 1. Dừng các track của local stream để tắt camera/mic
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                console.log(`Stopping track: ${track.kind}`);
                track.stop();
            });
            console.log('All local stream tracks stopped.');
        }

        // 2. Đóng kết nối peer-to-peer
        if (this.peerConnection) {
            // Gỡ bỏ các event listener để tránh memory leak
            this.peerConnection.onicecandidate = null;
            this.peerConnection.ontrack = null;
            this.peerConnection.onconnectionstatechange = null;
            this.peerConnection.onnegotiationneeded = null;

            this.peerConnection.close();
            console.log('Peer connection closed.');
        }

        // 3. Reset lại các biến nội bộ
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        console.log('WebRTCService state has been reset.');
    }
}

export const webRTCService = new WebRTCService();
export default WebRTCService;
