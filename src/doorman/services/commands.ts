import axios, { AxiosResponse } from 'axios';
import { Sequelize, Op, literal } from "sequelize";
import { Funding, FundingInstance } from '../../shared/models/models';
import { updateCurrentGeneration } from '../routes/hub';

const allowPaymentToAnyWorker = true;


export async function payAndGenerate(workerAddrPref: string, amt: number, reqObj: {headers: object, body: object}): Promise<any> {
    const {rHash, workerAddr} = await findPaymentAndPay(workerAddrPref, amt);
    if (!rHash || !workerAddr) {
        console.error("No payment found");
        return
    } 
    const bossmanGenImgResponse = callGenerateImage(workerAddr, rHash, reqObj);
    
    // TODO - parse the response
    return bossmanGenImgResponse;
}

async function findPaymentAndPay(workerAddrPref: string, amt: number): Promise<{rHash: string, workerAddr: string} | undefined> {
    
    // Step1: try to pay with preferred workerAddr
    const funding = await Funding.findOne({
        where: Sequelize.literal('worker_addr = :worker_addr AND amount - credits_used >= 10 AND is_paid = true'),
            replacements: { worker_addr: workerAddrPref }
    });
    if (funding) {
        funding.credits_used += 10;
        await funding.save();
        updateCurrentGeneration("workerAddr", funding.worker_addr);
        return {rHash: funding.r_hash, workerAddr: funding.worker_addr};
    }

    // Step2: find any workerAddr with enough credits
    if (allowPaymentToAnyWorker) {
        const funding : FundingInstance = await Funding.findOne({
            where: Sequelize.literal('amount - credits_used >= 10 AND is_paid = true'),
        });
        if (funding) {
            funding.credits_used += 10;
            await funding.save();
            updateCurrentGeneration("workerAddr", funding.worker_addr);
            console.log("Prefered Worker not available, using worker:", funding.worker_addr)
            return  {rHash: funding.r_hash, workerAddr: funding.worker_addr};
        }
    }
    return;
}

export async function callGenerateImage(workerAddr: string, r_hash: string, reqObj: {headers: object, body: object} ): Promise<any> {
    
    
    const endpoint = `http://${workerAddr}/command/generate/image`; 

    
    const headers = {
        "Content-Type": "application/json",
        "lightning_r_hash": r_hash,
    };
    
    const body = reqObj;

    try {
        const response: AxiosResponse = await axios.post(endpoint, body, { headers: headers });
        // TODO - this is where we handle L402
        return response.data;
    } catch (error) {
        console.error(error.message );
        if (error?.response) console.error(error.response?.data);
    }
}