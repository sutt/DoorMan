import express, { Request, Response } from "express"
import { Funding, FundingInstance } from '../../shared/models/models';
import { Sequelize, Op, DataType}  from "sequelize";


const router = express.Router()

const latestGeneration = {
    workerAddr: "Romulus-GPU",
    responseTime: 6.7,
    fee: 15,
}

const uiState = {
    isGenerating: false,
    generationStartedAt: null,
    workerAddr: null,
    //TODO - better way to track with the queue
    taskId: null,               
}

function updateUiState(key: string, value: any) {
    uiState[key] = value;
}

export function updateLatestGeneration(key: string, value: any) {
    latestGeneration[key] = value;
}

export function startGeneration() {
    console.log("start_generation")
    updateUiState("isGenerating", true);
    updateUiState("generationStartedAt", new Date());
    updateUiState("workerAddr", "stubbing it...");
}

export function resetGeneration() {
    console.log("reset_generation", uiState)
    let elapsed = null
    try {
        elapsed = new Date().getTime() - uiState.generationStartedAt.getTime();
    } catch (error) {}
    updateLatestGeneration("responseTime", elapsed);
    updateLatestGeneration("fee", 15);
    updateLatestGeneration("workerAddr", uiState.workerAddr);
    
    updateUiState("isGenerating", false);
    updateUiState("generationStartedAt", null);
    updateUiState("workerAddr", null);
}

router.get("/start_generation", async (req, res) => {
    
    // resetGeneration() is fired after payAndGenerate() is called, 
    // specificially in queue.complete(task) with a 500ms timeout
    // sometimes this route hasn't been called yet
    startGeneration();

    res.json({status: "ok"})
})


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
        latest_generation: latestGeneration,
        ui_state: uiState,
    }

    res.json(data)
    
})



export default router;