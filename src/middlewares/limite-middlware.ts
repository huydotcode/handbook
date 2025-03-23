import rateLimit from 'express-rate-limit';
import RedisStore, { RedisReply } from 'rate-limit-redis';
import redis from '../services/redis';

const limiteMiddlware = rateLimit({
    store: new RedisStore({
        sendCommand: (...args: string[]) => redis.call(...args as [string, ...string[]]) as Promise<RedisReply>,
    }),
    windowMs: 60 * 1000, // 1 phút
    max: process.env.NODE_ENV === 'production' ? 50 : 1000, // Tối đa 10 request/phút
    message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
});

export default limiteMiddlware;