import express from "express";
import path from "path";

import mockRunPredict from "./data/mock-data/mock.run.predict.json";
import mockInternalProgress from "./data/mock-data/mock.internal.progress.json";
import mockInfo from "./data/mock-data/mock.info.json";

const app = express();

console.log(mockInfo)

// Serve static files
app.use(express.static(path.join(__dirname, "../front-ui/v1")));

app.get("/info", (req, res) => {
    res.json(mockInfo)
    // this mock data might not have to be accurate or complete,
    // as long as client frontend just parses the json successfully
    // it will prevent other things from breaking
})

app.post("/run/predict", (req, res) => {
    res.json(mockRunPredict)
    // can use this route for timing of when frontend is loaded
    // and switch ws proxy to the right target
})

app.post("/internal/progress", (req, res) => {
    res.json(mockInternalProgress)
})

app.get("/admin", (req, res) => {
    res.json({"data":["admin", "panel"]})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});