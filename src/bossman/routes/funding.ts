import express, { Request, Response } from 'express';
import { createInvoicePayment, checkInvoicePayment } from "../services/lnbits/invoice";
import { CreateInvoiceResponse, CheckInvoiceResponse } from '../services/lnbits/invoice';
import { Invoice } from '../../shared/models/models';

const wltInvoiceKey = process.env.INVOICE_KEY || "";

const router = express.Router();

router.post('/create_invoice_payment', async (req: Request, res: Response) => {
    const {amt, hookId } = req.body;
    try {
        const data: CreateInvoiceResponse | undefined = await createInvoicePayment(wltInvoiceKey, amt, hookId);
        
        if (data) {
            
            const invoice = Invoice.build({
                r_hash: data.payment_hash,
                invoice_encoded: data.payment_request,
                amount: amt, 
                is_paid: false, 
                
            });
            await invoice.save();

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
        const invoice = await Invoice.findOne({ where: { r_hash: checkingId } });
        if (invoice && invoice.is_paid) {
            res.json({ message: 'Payment is already made' });
            return;
        }
        const data: CheckInvoiceResponse | undefined = await checkInvoicePayment(wltInvoiceKey, checkingId);
        if (data) {
            if (data.paid && invoice && !invoice.is_paid) {
                invoice.is_paid = true;
                await invoice.save();
            }
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


