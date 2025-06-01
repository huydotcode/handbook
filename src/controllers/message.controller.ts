import { NextFunction, Request, Response } from 'express';
import Message from '../models/message.model';
import { POPULATE_USER } from '../utils/populate';
import { getDecodedTokenFromHeaders } from '../utils/jwt';
import Conversation from '../models/conversation.model';

class MessageController {
    public async getMessages(req: Request, res: Response): Promise<void> {
        const conversationId = req.query.conversation_id;
        const page = req.query.page || 1;
        const pageSize = req.query.page_size || 10;

        if (!conversationId) {
            res.status(400).json({ message: 'Conversation ID is required' });
        }

        try {
            const user = await getDecodedTokenFromHeaders(req.headers);
            if (!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: {
                    $in: [user.id],
                },
            });
            if (!conversation) {
                res.status(404).json({ message: 'Conversation not found' });
                return;
            }

            const messages = await Message.find({
                conversation: conversationId,
            })
                .skip((+page - 1) * +pageSize)
                .limit(+pageSize)
                .populate('sender', POPULATE_USER)
                .populate('conversation')
                .populate('media')
                .sort({ createdAt: -1 });

            res.status(200).json(messages);
        } catch (error) {
            console.log('Error fetching messages:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async getPinnedMessages(req: Request, res: Response): Promise<void> {
        const conversationId = req.query.conversation_id;
        const page = req.query.page || 1;
        const pageSize = req.query.page_size || 10;

        try {
            const user = await getDecodedTokenFromHeaders(req.headers);
            if (!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            if (!conversationId) {
                res.status(400).json({
                    message: 'Conversation ID is required',
                });
            }

            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: {
                    $in: [user.id],
                },
            });
            if (!conversation) {
                res.status(404).json({ message: 'Conversation not found' });
                return;
            }

            const messages = await Message.find({
                conversation: conversationId,
                isPin: true,
            })
                .skip((+page - 1) * +pageSize)
                .limit(+pageSize)
                .populate('sender', POPULATE_USER)
                .populate('conversation')
                .populate('media')
                .sort({ createdAt: -1 });

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async search(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const q = req.query.q;
        const conversationId = req.query.conversation_id;

        try {
            const user = await getDecodedTokenFromHeaders(req.headers);
            if (!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: {
                    $in: [user.id],
                },
            });

            if (!conversation) {
                res.status(404).json({ message: 'Conversation not found' });
                return;
            }

            const messages = await Message.find({
                conversation: conversationId,
                text: {
                    $regex: q,
                    $options: 'i',
                },
            })
                .populate('sender', POPULATE_USER)
                .populate('conversation')
                .populate('media')
                .sort({ createdAt: -1 });

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new MessageController();
