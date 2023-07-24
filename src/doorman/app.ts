import express from "express";
import path from "path";
import { setupProxy } from "../shared/proxy/basic";
import apiRouter from "./routes/api";

import mockRunPredict from "../data/mock-data/mock.run.predict.json";
import mockInternalProgress from "../data/mock-data/mock.internal.progress.json";
import mockInfo from "../data/mock-data/mock.info.json";

import workerData from "../data/workers.json";


export function runDoormanServer({
    publicPort = 8080,
    publicHost = "127.0.0.1",
}) {

    const app = express();

    const state = {
        currentWorkerHost: null,
        currentWorkerPort: null,
    }

    app.set("view engine", "ejs");
 
    app.set('views', path.join(__dirname, "..", "views"))

    app.use(express.json());

    app.use('/api', apiRouter);

    // Serve static files of UI - 
    // TODO: change this url from root w/o it breaking the ui load
    app.use("/", express.static(path.join(__dirname, "./../../front-ui/v1")));



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

    const {server: proxyServer, updateState: updateProxyServer} = setupProxy({
        wsHost: "localhost",
        wsPort: 7862,  // bossman proxy port
        httpHost: "localhost",
        httpPort: 3001,  //static frontui server
      })


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

    const staticServerPort = 3001;

    app.listen(staticServerPort, publicHost, () => {
        console.log(`FileServer/MockServer is listening on port ${staticServerPort}`)
    });


    proxyServer.listen(publicPort, publicHost, () => {
        console.log(`Doorman server runnining... public proxy is running on host ${publicHost} port ${publicPort}`);
    });

}