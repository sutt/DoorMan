import express, { Request, Response } from "express"
import { Funding, FundingInstance } from '../../shared/models/models';
import { Sequelize, Op, DataType}  from "sequelize";


const router = express.Router()

const currentGeneration = {
    workerAddr: null,
    success: null,
    responseTime: null,
    fee: null,
}

export function updateCurrentGeneration(key: string, value: any) {
    currentGeneration[key] = value;
}


router.get("/current_generation_info", async (req, res) => {
    res.json(currentGeneration)
})


router.get("/start_generation", async (req, res) => {
    
    // DEPRECATED
    // console.log("start_generation");
    res.json({status: "ok"})
})


// We don't use this currently
router.get("/info", async (req, res) => {    

    const totalFundingEvents = await Funding.count({where: {is_paid: true}});

    const fundingsWithCredit = await Funding.count({
        where: {
            [Op.and]: [
                { is_paid: true },
                Sequelize.where(
                    // Sequelize.literal('(amount - credits_used)'),  //gpt hallucination?
                    Sequelize.col('amount'),
                    '>',
                    Sequelize.col('credits_used')
                )
            ]
        }
    });

    const workersAndCredits = await Funding.findAll({
        attributes: [
            'worker_addr',
            [Sequelize.literal('SUM(amount - credits_used)'), 'available_credits']
        ],
        where: {
            is_paid: true
        },
        group: ['worker_addr'],
        having: Sequelize.where(
            Sequelize.literal('SUM(amount - credits_used)'),
            '>',
            0
        )
    });
        
    const numberOfFundedWorkers = workersAndCredits.length;

    const creditsAvailable = workersAndCredits.reduce((acc, cur) => { return acc + cur.getDataValue('available_credits') }, 0);
    
    const fundingData = {
        
        number_of_funded_workers: numberOfFundedWorkers,
        total_funding_events: totalFundingEvents,
        credits_available: creditsAvailable,
        
        fundings_with_credit: fundingsWithCredit,
        workers_and_credits: workersAndCredits,

    }

    const data = {
        funding: fundingData,
        // latest_generation: latestGeneration,
        // ui_state: uiState,
    }

    res.json(data)
    
})



export default router;