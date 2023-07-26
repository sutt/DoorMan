import express from "express"
import mockRunPredict from "../../data/mock-data/mock.run.predict.json";
import mockInternalProgress from "../../data/mock-data/mock.internal.progress.json";
import mockInfo from "../../data/mock-data/mock.info.json";
import { payAndGenerate } from "../services/commands";
const router = express.Router()

// Mock responses to XHR calls made from UI onLoad

router.get("/info", (req, res) => {
    res.json(mockInfo)
    // this mock data might not have to be accurate or complete,
    // as long as client frontend just parses the json successfully
    // it will prevent other things from breaking
})

const workerAddr = "localhost:8090"

router.post("/run/predict", async (req, res) => {
    let isImgGen = false
    try {
        if (req.body.data[0].startsWith("task(")) {
            isImgGen = true
            const reqObj = {
                headers: req.headers,
                body: req.body
            }
            console.log("paying and generating")
            const response = await payAndGenerate(workerAddr, 10, reqObj)
            if (response) {
                console.log(response)
                res.json(response)
                return;
            }
        }
    } catch (error) {
        1+1
    }
    console.log(`isImgGen: ${isImgGen}`)
    res.json(mockRunPredict)
    // can use this route for timing of when frontend is loaded
    // and switch ws proxy to the right target
})


router.post("/internal/progress", (req, res) => {
    res.json(mockInternalProgress)
})


export default router;
