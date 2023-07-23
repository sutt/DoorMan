import express, { Request, Response } from 'express';
import { createInvoicePayment, checkInvoicePayment } from "../services/lnbits/invoice";
import { PaymentResponse } from '../services/lnbits/invoice';

const router = express.Router();

router.post('/create_invoice_payment', async (req: Request, res: Response) => {
    const { wltInvoiceKey, amt, hookId } = req.body;
    try {
        const data: PaymentResponse | undefined = await createInvoicePayment(wltInvoiceKey, amt, hookId);
        // send back hash and payment_request
        res.json(data);
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
        res.json(data);
    } catch (err) {
        console.error("check_invoice_payment", err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Funding router' });
});

export default router;


