import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import { callCreateInvoicePayment } from '../services/funding';
import { PaymentResponse } from '../services/funding';

const router = express.Router();

router.get('/' , async (req: Request, res: Response) => {
    res.send('Hello World!');
});

router.post('/funding_request' , async (req: Request, res: Response) => {
    try {
        const {amount, workerAddr} = req.body;
        // parseInt(amount);
        const response : PaymentResponse | null = await callCreateInvoicePayment(workerAddr, amount, null);
        if (response) {
            const qrDataURL = await QRCode.toDataURL(response.payment_request);
            res.json({ qrDataURL: qrDataURL, data: response });
            return;
        }
        res.status(500).json({ error: "callCreateInvoice failed" });
        return
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});

export default router;