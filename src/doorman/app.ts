import express from "express";
import path from "path";
import { setupProxy } from "./shared/proxy/basic";

import mockRunPredict from "./data/mock-data/mock.run.predict.json";
import mockInternalProgress from "./data/mock-data/mock.internal.progress.json";
import mockInfo from "./data/mock-data/mock.info.json";

import workerData from "./data/workers.json";

const proxyPort = 8080;
const proxyHost = "127.0.0.1";

const app = express();

const state = {
    currentWorkerHost: null,
    currentWorkerPort: null,
}

app.set("view engine", "ejs");

app.set('views', path.join(__dirname, "..", "src", "views"))

app.use(express.json());

// Serve static files of UI - 
// TODO: change this url from root w/o it breaking the ui load
app.use("/", express.static(path.join(__dirname, "../front-ui/v1")));

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
app.get("/home", (req, res) => {
    res.render("home", {title: "Home"})
})

const {server: proxyServer, updateState: updateProxyServer} = setupProxy()


app.get("/admin", (req, res) => {
    // res.render("admin", {title: "Admin"})
    res.render("admin2", {workers: workerData.workers})
})

app.post("/worker/", (req, res) => {
    const {host, port} = req.body;
    updateProxyServer("wsHost", host);
    updateProxyServer("wsPort", port);
    res.json({status: "ok"});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});


proxyServer.listen(proxyPort, proxyHost, () => {
    console.log(`Proxy is running on host ${proxyHost} port ${proxyPort}`);
});

