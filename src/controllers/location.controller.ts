import { Request, Response } from 'express';
import Location from '../models/location.model';

class LocationController {
    public async getLocations(req: Request, res: Response) {
        try {
            const locations = await Location.find();

            res.status(200).json(locations);
        } catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }
}

export default new LocationController();