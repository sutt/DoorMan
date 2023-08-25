import express, { Request, Response } from 'express';
import { checkAppRunning } from '../services/commands';

// TODO - json response of fees, features, availability, etc.

const router = express.Router();

router.get('/available', async (req: Request, res: Response) => {
    const isAvailable = await checkAppRunning();
    res.json({ available: isAvailable });
});

export default router;