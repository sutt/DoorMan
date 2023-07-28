import express from "express";
import path from "path";
import cors from "cors";
import apiRouter from "./routes/api";
import mockRouter, { updateState } from "./routes/mock-front";
import hubRouter from "./routes/hub";

import workerData from "../data/workers.json";

// import { setupProxy } from "../shared/proxy/basic";
// import { addHeaderCallback } from "./services/attach";

export function runDoormanServer({
    publicPort = 8080,
    publicHost = "localhost",
    serverPort = 3001,
    serverHost = "localhost",
}) {
    
    // const {server: proxyServer, updateState: updateProxyServer} = setupProxy({
    //     wsHost: "localhost",
    //     wsPort: 7861,  // bossman proxy port
    //     httpHost: "localhost",
    //     httpPort: 3001,  //static frontui server
    //     addHeaderCallback: addHeaderCallback,
    //   })

    const app = express();

    app.set("view engine", "ejs");
    app.set('views', path.join(__dirname, "..", "views"))
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cors());

    app.use('/api', apiRouter);
    app.use('/hub', hubRouter);
    
    // TODO: change this url from root w/o it breaking the ui load
    app.use("/", express.static(path.join(__dirname, "./../../front-ui/v1")));
    app.use("/", mockRouter);  // needs to be root to be compatible with the frontend ui relative paths 

    app.get("/home", (req, res) => {
        res.render("home", {title: "Home"})
    })
    
    app.get("/admin", (req, res) => {
        res.render("admin2", {workers: workerData.workers})
    })

    app.post("/worker", (req, res) => {
        const {host, port} = req.body;
        updateState("workerAddr", `${host}:${port}`);
        res.json({status: "ok"});
    })

    app.listen(serverPort, serverHost, () => {
        console.log(`Doorman File Server & Frontend-API is listening on ${serverHost}:${serverPort}`)
    });

    // proxyServer.listen(publicPort, publicHost, () => {
    //     console.log(`Doorman server runnining...\nPublic proxy is listening on ${publicHost}:${publicPort}`);
    // });

}