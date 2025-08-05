'use client';

import React, { useState } from 'react';
import { VideoCallButton } from '@/components/video-call/VideoCallButton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function VideoCallTestPage() {
    const [targetUserId, setTargetUserId] = useState('');

    return (
        <div className="container mx-auto max-w-2xl p-6">
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <h1 className="mb-6 text-2xl font-bold">Video Call Test</h1>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Target User ID
                        </label>
                        <Input
                            type="text"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder="Enter user ID to call"
                        />
                    </div>

                    <div className="flex gap-4">
                        <VideoCallButton
                            targetUserId={targetUserId}
                            size="lg"
                            variant="default"
                        />
                        <Button
                            onClick={() => setTargetUserId('')}
                            variant="outline"
                        >
                            Clear
                        </Button>
                    </div>

                    <div className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                        <h3 className="mb-2 font-semibold">Instructions:</h3>
                        <ul className="space-y-1 text-sm">
                            <li>• Enter a valid user ID in the input field</li>
                            <li>
                                • Click the video call button to initiate a call
                            </li>
                            <li>
                                • The target user will receive an incoming call
                                notification
                            </li>
                            <li>
                                • Both users need to be online for the call to
                                work
                            </li>
                            <li>
                                • Make sure to allow camera and microphone
                                permissions
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
