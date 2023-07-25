import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import { callCreateInvoicePayment, callCheckInvoicePayment } from '../services/funding';
import { PaymentResponse } from '../services/funding';
import { Funding, FundingInstance } from '../../shared/models/models';
import { Sequelize}  from "sequelize";

const router = express.Router();

// These respond to XHR calls from the admin webpage scripts

router.post('/funding_request' , async (req: Request, res: Response) => {
    let errMsg = "";
    try {
        const {amount, workerAddr} = req.body;
        const response : PaymentResponse | undefined = await callCreateInvoicePayment(workerAddr, amount, null);
        if (response) {
            const funding = Funding.build({
                worker_addr: workerAddr,
                r_hash: response.payment_hash,
                amount: amount,
                is_paid: false,
            });
            await funding.save();
            const qrDataURL = await QRCode.toDataURL(response.payment_request);
            res.json({ qrDataURL: qrDataURL, data: response });
            return;
        } else {
            errMsg = "returned undefined";
        }
    } catch (error) {
        errMsg = error.message;
    }
    console.error("doorman-server /api/funding_request", errMsg);
    res.status(500).json({ error: errMsg });
    
});

router.post('/check_payment', async (req: Request, res: Response) => {
    try {
        const { workerAddr, checkingId } = req.body;
        const funding : FundingInstance = await Funding.findOne({ where: { worker_addr: workerAddr, r_hash: checkingId } });
        if (funding.is_paid) {
            res.json({ is_paid: true });
            return;
        }
        const isPaid: boolean = await callCheckInvoicePayment(workerAddr, checkingId);
        if (isPaid ) {
            funding.is_paid = true;
            await funding.save();
        }   
        res.json({ is_paid: isPaid });
    } catch (error) {
        res.status(500).json({ is_paid: false, error: error.message });
    }
});

router.get('/funding_summary', async (req: Request, res: Response) => {
    try {
        const data = await Funding.findAll({
            group: ['worker_addr'],
            attributes: [
                'worker_addr', 
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                [Sequelize.fn('SUM', Sequelize.col('credits_used')), 'total_credits_used'],
            ],
        });
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'An error occurred' });
    }
});


export default router;