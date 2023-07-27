import axios, { AxiosResponse } from 'axios';
import { Sequelize, Op, literal } from "sequelize";
import { Funding, FundingInstance } from '../../shared/models/models';


export async function payAndGenerate(workerAddr: string, amt: number, reqObj: {headers: object, body: object}): Promise<any> {
    const r_hash = await findPaymentAndPay(workerAddr, amt);
    if (!r_hash) {
        console.error("No payment found");
        // return;
    }
    reqObj.headers["lightning_r_hash"] = r_hash;
    const bossmanGenImgResponse = callGenerateImage(workerAddr, reqObj);
    // TODO - parse the response
    return bossmanGenImgResponse;
}

async function findPaymentAndPay(workerAddr: string, amt: number): Promise<string | undefined> {
    const funding = await Funding.findOne({
        where: Sequelize.literal('worker_addr = :worker_addr AND amount - credits_used >= 10'),
            replacements: { worker_addr: workerAddr }
    });
    if (funding) {
        funding.credits_used += 10;
        await funding.save();
        return funding.r_hash;
    }
    return;
}

export async function callGenerateImage(workerAddr: string, reqObj: {headers: object, body: object} ): Promise<any> {
    
    
    const endpoint = `http://${workerAddr}/command/generate/image`; 

    // const headers = reqObj.headers;
    // const body = reqObj.body;
    const headers = {
        "Content-Type": "application/json"
    };
    const body = reqObj;

    try {
        const response: AxiosResponse = await axios.post(endpoint, body, { headers: headers });
        // TODO - this is where we handle L402
        return response.data;
    } catch (error) {
        console.error(error);
    }
}