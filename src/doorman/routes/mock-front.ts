import express, { Request, Response } from "express"
import mockRunPredict from "../../data/mock-data/mock.run.predict.json";
import mockInternalProgress from "../../data/mock-data/mock.internal.progress.json";
import mockInfo from "../../data/mock-data/mock.info.json";
import { payAndGenerate } from "../services/commands";
import { downloadImage } from "../services/download";

const router = express.Router()

// Mock responses to XHR calls made from UI onLoad

router.get("/info", (req, res) => {
    res.json(mockInfo)
    // this send the type info for all the xhr calls used in the gui
    // each call has an "fn" number associated with it
})

const workerAddr = "localhost:8090"

function checkRequestIsImgGen(req: Request): boolean {
    try {
        return req.body.data[0].startsWith("task(");
    } catch (error) {
        return false;
    }
}

function getImageUrlFromData(data: any): string | undefined {
    try {
        return data.data[0][0].name;
    } catch (error) {
        return undefined;
    }
    return undefined;
}

function changeImgUrlOnData(data: any, imgUri: string, newUrl?: string): any {
    try {
        data.data[0][0].is_file = false
        data.data[0][0].data = imgUri
        if (newUrl) {
            data.data[0][0].name = newUrl;
        } else {
            delete data.data[0][0].name   
        }
        return data;
    } catch (error) {
        return undefined;
    }
    return data;
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
        
        // startQueue(parseTask(req))
        // TODO - we want to know if it's 500 or 402
        // TODO - we want the r_hash to access the image
        const response = await payAndGenerate(workerAddr, 10, reqObj)
        // endQueue(parseTask(req))
        
        if (!response) {
            errMsg = "payAndGenerate returned undefined";
        } else {
            const imgFnOriginal = getImageUrlFromData(response)
            if (!imgFnOriginal) {
                errMsg = "getImageUrlFromData returned undefined";
            } else {
                // TODO - need a way to proxy this server-side
                const downloadUrl = `http://localhost:7861/file=${imgFnOriginal}`
                const {dataUri, fnLocal} = await downloadImage(downloadUrl)
                if (!dataUri) {
                    errMsg = "downloadImage returned undefined";
                } else {
                    const responseNewFn  = changeImgUrlOnData(response, dataUri, fnLocal)
                    res.json(responseNewFn)
                    return;
                }
            } 
        }
        // Something went wrong along the chain of calls
        // TODO - send back actual data that will show 402 / 500 message in gui
        console.error("doorman: /run/predict", errMsg);
        res.status(500).json({ error: errMsg });
        
    }
})


router.post("/internal/progress", (req, res) => {
    res.json(mockInternalProgress)
})


export default router;
