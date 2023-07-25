import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import { callCreateInvoicePayment, callCheckInvoicePayment } from '../services/funding';
import { PaymentResponse } from '../services/funding';

const router = express.Router();

// These respond to XHR calls from the admin webpage scripts

router.get('/' , async (req: Request, res: Response) => {
    res.send('Hello World!');
});

router.post('/funding_request' , async (req: Request, res: Response) => {
    try {
        const {amount, workerAddr} = req.body;
        // parseInt(amount);
        const response : PaymentResponse | undefined = await callCreateInvoicePayment(workerAddr, amount, null);
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

router.post('/check_payment', async (req: Request, res: Response) => {
    try {
        const { workerAddr, checkingId } = req.body;
        const isPaid: boolean = await callCheckInvoicePayment(workerAddr, checkingId);
        res.json({ is_paid: isPaid });
    } catch (error) {
        res.status(500).json({ is_paid: false, error: error.message });
    }
});

export default router;