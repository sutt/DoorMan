import http from "http";
import { Sequelize, Op, literal } from "sequelize";
import { Funding, FundingInstance } from '../../shared/models/models';


export async function addHeaderCallback(workerHost : string, apiPort: number): Promise<string | undefined> {

    const worker_addr = `${workerHost}:${apiPort}`;
    console.log(`addHeaderCallback: ${worker_addr}`)
    
    const funding = await Funding.findOne({
        where: Sequelize.literal('worker_addr = :worker_addr AND amount - credits_used >= 10'),
            replacements: { worker_addr: worker_addr }
    });
    
    console.log(`addHeaderCallback: ${funding}`)
    
    if (!funding) {
        return;
    }
    
    funding.credits_used += 10;
    await funding.save();
    
    return funding.r_hash;
}