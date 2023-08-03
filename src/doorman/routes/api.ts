import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import { callCreateInvoicePayment, callCheckInvoicePayment } from '../services/funding';
import { PaymentResponse } from '../services/funding';
import { Funding, FundingInstance } from '../../shared/models/models';
import { Sequelize}  from "sequelize";

import workerData from "../../data/workers.json";

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
            where: {
                is_paid: true,
            }
        });
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'An error occurred' });
    }
});


router.get('/workers_funding_summary', async (req: Request, res: Response) => {
    
    // return TOP 2 workers, sorted by available credits

    let data = await workers_summary_data();
    
    data.sort((a, b) =>  b.credits - a.credits)

    data = data.filter(worker => worker.credits > 0)

    data = data.slice(0,2)

    res.json(data);

});


interface WorkerObject {
    "name": string,
    "worker_addr": string,
    "fee": number,
    "credits": number,
  }

export interface FundingSummaryInstance {
    worker_addr: string;
    total_amount: number;
    total_credits_used : number;
  }

async function funding_summary_data(): Promise<FundingSummaryInstance[]> {
    try {
        const data = await Funding.findAll({
            group: ['worker_addr'],
            attributes: [
                'worker_addr', 
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
                [Sequelize.fn('SUM', Sequelize.col('credits_used')), 'total_credits_used'],
            ],
            where: {
                is_paid: true,
            }
        });
        const summaryData: FundingSummaryInstance[] = data.map(funding => ({
            worker_addr: funding.worker_addr,
            total_amount: Number(funding.getDataValue('total_amount')),
            total_credits_used: Number(funding.getDataValue('total_credits_used'))
        }));

        return summaryData;
        
    } catch (err) {
        console.error(err.message);
    }
}

export async function workers_summary_data(): Promise<WorkerObject[]> {
    
    // join workers from json file...
    // ...to funding data from Funding table

    const workers = workerData.workers
        
    const fundingSummary: FundingSummaryInstance[] = await funding_summary_data()
    
    const workersData = workers.map(workerObj => {
            
        const newWorkerObj: WorkerObject = {...workerObj, credits: 0}
        let workerCredits = 0
            
        fundingSummary.forEach(fundingObj  => {
            if (fundingObj.worker_addr === workerObj.worker_addr) {
                workerCredits = fundingObj.total_amount - fundingObj.total_credits_used
            }
        })
            
        newWorkerObj.credits = workerCredits
        return newWorkerObj

    })
    
    return workersData
}


export default router;