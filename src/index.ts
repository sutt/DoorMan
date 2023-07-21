import express from "express";
import path from "path";
import { setupProxy } from "./shared/proxy/basic";

import mockRunPredict from "./data/mock-data/mock.run.predict.json";
import mockInternalProgress from "./data/mock-data/mock.internal.progress.json";
import mockInfo from "./data/mock-data/mock.info.json";

const proxyPort = 8080;
const proxyHost = "127.0.0.1";

const app = express();

// Serve static files of UI
app.use(express.static(path.join(__dirname, "../front-ui/v1")));

// Mock responses to XHR calls made from UI onLoad
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

// Define our app's routes here
app.get("/admin", (req, res) => {
    res.json({"data":["admin", "panel"]})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

const proxyServer = setupProxy()

proxyServer.listen(proxyPort, proxyHost, () => {
    console.log(`Proxy is running on host ${proxyHost} port ${proxyPort}`);
});

