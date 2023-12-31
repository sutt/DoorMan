import express, { Request, Response } from "express"
import mockRunPredict from "../../data/mock-data/mock.run.predict.json";
import mockInternalProgress from "../../data/mock-data/mock.internal.progress.json";
import mockInfo from "../../data/mock-data/mock.info.json";
import mockResponse402 from "../../data/mock-data/mock.response.402.json";
import { payAndGenerate } from "../services/commands";
import { writeImage } from "../services/download";
import { Queue, parseTaskId, progressResponse } from "../services/queue";
import { updateCurrentGeneration } from "./hub";

const router = express.Router()

const queue = new Queue();

// Mock responses to XHR calls made from UI onLoad

router.get("/info", (req, res) => {
    res.json(mockInfo)
    // this send the type info for all the xhr calls used in the gui
    // each call has an "fn" number associated with it
})


function checkRequestIsImgGen(req: Request): boolean {
    try {
        return req.body.data[0].startsWith("task(");
    } catch (error) {
        return false;
    }
}

function getImageUriFromData(data: any): string | undefined {
    try {
        return data.data[0][0].data;
    } catch (error) {
        return undefined;
    }
    return undefined;
}

const state = {
    //this is actually preferred worker
    // if allowPaymentToAnyWorker is true, 
    // this is who payment/generation should 
    // go to if others available
    workerAddrPref: "",  
    
};
  
export function updateState (key : string, value : any) {
    state[key] = value;    
    console.log(`updateState: ${key} = ${value}`)
}



router.post("/run/predict", async (req: Request, res: Response) => {
    
    const isImgGen = checkRequestIsImgGen(req)
    
    if (!isImgGen) {
        // these are calls made when ui loads
        // switch on `fn` value in the request body
        res.json(mockRunPredict)

    } else {
        
        let errMsg = "";
        const reqObj = {
            headers: req.headers,
            body: req.body
        }
        
        const taskId = parseTaskId(req.body.data[0])
        const startTime = new Date().getTime()
        
        queue.add(taskId)
        
        updateCurrentGeneration("fee", 10)
        updateCurrentGeneration("success", null)
        updateCurrentGeneration("responseTime", null)
        // cant update "workerAddr" since 
        // next function might not use workerAddrPref
        updateCurrentGeneration("workerAddr", null)
        
        // TODO - we want to know if it's 500 or 402
        const response = await payAndGenerate(state.workerAddrPref, 10, reqObj)
        
        queue.complete(taskId)

        updateCurrentGeneration("responseTime", new Date().getTime() - startTime)
        
        if (!response) {
            errMsg = "payAndGenerate returned undefined";
        } else {
            const imgUri = getImageUriFromData(response)
            const fnLocal = await writeImage(imgUri) // TODO - this can be async
            
            if (!imgUri)  {errMsg += "no data uri found on response data";}
            if (!fnLocal) {errMsg += "writeImage returned undefined";}
            if (errMsg) {console.error(`doorman-server /run/predict: ${errMsg}`)}
            
            updateCurrentGeneration("success", true)
            
            res.json(response)
            return;
        }
        
        // Something went wrong along the chain of calls
        // TODO - 402 vs 500
        updateCurrentGeneration("success", false)
        console.error("doorman: /run/predict", errMsg);
        setTimeout(() => {
            res.json(mockResponse402)
        }, 500);

        
    }
})


router.post("/internal/progress", (req, res) => {
    try {
        const taskId = parseTaskId(req.body)
        const completed = queue.check(taskId)
        const response = progressResponse(completed, 0.0)
        res.json(response)
        
        // failed progress bar spoofing
        // const progress = 0.0
        // res.header("Access-Control-Allow-Credentials", "true");
        // res.header("Content-Type"  ,"application/json");
    
    } catch (error) {
        console.error("doorman: /internal/progress", error.message);
        res.json(mockInternalProgress)
    }
})


export default router;
