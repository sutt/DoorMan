import express from "express"
import mockRunPredict from "../../data/mock-data/mock.run.predict.json";
import mockInternalProgress from "../../data/mock-data/mock.internal.progress.json";
import mockInfo from "../../data/mock-data/mock.info.json";

const router = express.Router()

// Mock responses to XHR calls made from UI onLoad

router.get("/info", (req, res) => {
    res.json(mockInfo)
    // this mock data might not have to be accurate or complete,
    // as long as client frontend just parses the json successfully
    // it will prevent other things from breaking
})


router.post("/run/predict", (req, res) => {
    res.json(mockRunPredict)
    // can use this route for timing of when frontend is loaded
    // and switch ws proxy to the right target
})


router.post("/internal/progress", (req, res) => {
    res.json(mockInternalProgress)
})


export default router;
