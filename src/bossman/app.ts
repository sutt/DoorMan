import express from "express";
import http from "http";

import invoiceRestRouter from "./routes/invoice-rest";
import fundingRouter from "./routes/funding";
import validateRouter from "./routes/validate";

import { setupProxy } from "../shared/proxy/basic";
import { checkHeaderCallback } from "./services/validate";


export function runBossmanServer({
    publicPort = 7862,
    publicHost = "127.0.0.1",
    serverPort = 8090,
    serverHost = "127.0.0.1",
}) {

    const {server: proxyServer } = setupProxy(
        {
            wsHost: "127.0.0.1",
            wsPort: 7861,    // target port for locally running StablieDiffusion
            httpHost: "127.0.0.1",
            httpPort: 7861,  // this is the server
            checkHeaderCallback: checkHeaderCallback,
    })

    const app = express();
    
    app.use(express.json());
    
    app.use('/invoices', invoiceRestRouter);
    app.use('/funding', fundingRouter);
    app.use('/validate', validateRouter);


    proxyServer.listen(publicPort, publicHost, () => {
        console.log(`Bossman Proxy server running on ${publicHost}:${publicPort}`)
    });

    app.listen(serverPort, serverHost, () => {
        console.log(`BossMan server running on ${serverHost}:${serverPort}`)
    });
}






