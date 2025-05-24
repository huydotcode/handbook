import { Request, Response } from 'express';
import Location from '../models/location.model';
import redis from '../services/redis';

class LocationController {
    public async getLocations(req: Request, res: Response) {
        try {
            const cacheKey = 'locations';

            // Kiểm tra xem Redis có dữ liệu không
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            // Nếu không có trong Redis, truy vấn MongoDB
            const locations = await Location.find().sort('name');
            await redis.set(cacheKey, JSON.stringify(locations));

            console.log('✅ Dữ liệu đã lưu vào Redis');
            return res.status(200).json(locations);
        } catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }
}

export default new LocationController();
