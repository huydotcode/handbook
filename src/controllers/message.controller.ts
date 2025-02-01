import { Request, Response } from 'express';

class MessageController {
    public async createMessage(req: Request, res: Response) {
        try {
            // Do something
            return res.status(200).json({ message: 'Message created' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
