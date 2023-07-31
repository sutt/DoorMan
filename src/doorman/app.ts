import express from "express";
import path from "path";
import cors from "cors";
import apiRouter from "./routes/api";
import mockRouter, { updateState } from "./routes/mock-front";
import hubRouter from "./routes/hub";

import { workers_summary_data } from "./routes/api";

// import { setupProxy } from "../shared/proxy/basic";
// import { addHeaderCallback } from "./services/attach";

export function runDoormanServer({
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
    
    app.get("/admin", async (req, res) => {
        
        const workersData = await workers_summary_data();
        
        res.render("admin2", {workers: workersData})
    })

    app.post("/set_preferred_worker", (req, res) => {
        updateState("workerAddrPref",  req.body.worker_addr);
        res.json({status: "ok"});
    })

    app.listen(serverPort, serverHost, () => {
        console.log(`Doorman File Server & Frontend-API is listening on ${serverHost}:${serverPort}`)
    });

    // proxyServer.listen(publicPort, publicHost, () => {
    //     console.log(`Doorman server runnining...\nPublic proxy is listening on ${publicHost}:${publicPort}`);
    // });

}