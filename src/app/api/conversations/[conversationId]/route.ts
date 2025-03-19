import { Conversation } from '@/models';
import { NextRequest, NextResponse } from 'next/server';
import { POPULATE_USER } from '@/lib/populate';

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) => {
    try {
        const conversationId = (await params).conversationId;

        const conversation = await Conversation.findOne({
            _id: conversationId,
        })
            .populate('participants')
            .populate('creator', POPULATE_USER)
            .populate({
                path: 'group',
                populate: [
                    { path: 'avatar' },
                    { path: 'members.user', populate: POPULATE_USER },
                    { path: 'creator' },
                ],
            });

        if (!conversation) {
            return NextResponse.error();
        }

        return NextResponse.json(conversation, { status: 200 });
    } catch (error: any) {
        return NextResponse.error();
    }
};
