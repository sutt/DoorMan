import express, { Request, Response } from 'express';
import { createInvoicePayment, checkInvoicePayment } from "../services/lnbits/invoice";
import { PaymentResponse } from '../services/lnbits/invoice';

const wltInvoiceKey = process.env.INVOICE_KEY || "";

const router = express.Router();

router.post('/create_invoice_payment', async (req: Request, res: Response) => {
    const {amt, hookId } = req.body;
    try {
        const data: PaymentResponse | undefined = await createInvoicePayment(wltInvoiceKey, amt, hookId);
        
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'An error occurred, no data returned' });
        }
        
    } catch (err) {
        console.error("create_invoice_payment", err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.get('/check_invoice_payment/:checkingId', async (req: Request, res: Response) => {
    const { wltInvoiceKey } = req.body;
    const { checkingId } = req.params;
    try {
        const data: PaymentResponse | undefined = await checkInvoicePayment(wltInvoiceKey, checkingId);
        if (data) {
            res.json(data);
        } else {
            res.status(500).json({ message: 'An error occurred' });
        }
    } catch (err) {
        console.error("check_invoice_payment", err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Funding router' });
});

export default router;


