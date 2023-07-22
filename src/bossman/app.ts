import express from "express";
import axios from "axios";
import { Invoice } from "../shared/models/models";
import { setupProxy } from "../shared/proxy/basic";
import http from "http";

export function runBossmanServer({
    publicPort = 7862,
    publicHost = "127.0.0.1",
    serverPort = 8090,
    serverHost = "127.0.0.1",
}) {

    const {server: proxyServer, updateState: updateProxyServer} = setupProxy(
        {
            wsHost: "127.0.0.1",
            wsPort: 7861,    // target port for locally running StablieDiffusion
            httpHost: "127.0.0.1",
            httpPort: 7861,  // this is the server
            checkHeaderCallback: checkHeaderCallback,
    })

    proxyServer.listen(publicPort, publicHost, () => {
        console.log(`Bossman Proxy server running on ${publicHost}:${publicPort}`)
    });

    const app = express();

    app.use(express.json());

    app.post("/validate_and_pay", async (req, res) => {
        try {
            const { r_hash, credits_requested } = req.body;
            if (!r_hash || !credits_requested) {
                return res.status(400).json({ message: "r_hash and credits_requested must be provided" });
            }
    
            const invoice = await Invoice.findByPk(r_hash);
            if (invoice) {
                const available_credits = invoice.amount - invoice.credits_used;
                if (credits_requested > available_credits) {
                    res.status(402).json({ message: "Not enough available credits", invoice: [invoice] });
                } else {
                    invoice.credits_used += credits_requested;
                    await invoice.save();
                    res.json({ message: "Request successful", invoice: [invoice] });
                }
            } else {
                res.status(404).json({ message: "Invoice not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while processing the request" });
        }
    });
    

    app.get("/invoices", async (req, res) => {
        try {
            const invoices = await Invoice.findAll();
            res.json(invoices);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while retrieving invoices", error: error });
        }
    });
    
    
    app.get("/invoices/:r_hash", async (req, res) => {
        try {
            const invoice = await Invoice.findByPk(req.params.r_hash);
            if (invoice) {
                if (!invoice.is_paid) {
                    res.status(402).json({ message: "Invoice exists, not paid yet.", invoice: [invoice] });
                    return 
                } else if  ((invoice.is_paid) && (invoice.credits_used >= invoice.amount)) {
                    res.status(402).json({ message: "Invoice exists, but no credits left", invoice: [invoice] });
                    return
                } else {
                    res.status(200).json({message: "Invoice exists, has available credits", invoice: [invoice]});
                    return
                }
            } else {
                res.status(404).json({ message: "Invoice not found" });
                return
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while retrieving the invoice" });
        }
    });

    app.post("/invoices", async (req, res) => {
        try {
            const invoice = await Invoice.create(req.body);
            res.status(201).json(invoice);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while creating the invoice" });
        }
    });


    app.put("/invoices/:r_hash", async (req, res) => {
        try {
            const invoice = await Invoice.findByPk(req.params.r_hash);
            if (invoice) {
                if ("credits_requested" in req.body) {
                    const available_credits = invoice.amount - invoice.credits_used;
                    if (req.body.credits_requested > available_credits) {
                        res.status(400).json({ message: "Not enough available credits" });
                    } else {
                        invoice.credits_used += req.body.credits_requested;
                        await invoice.save();
                        res.json(invoice);
                    }
                } else {
                    res.status(400).json({ message: "No credits requested data provided" });
                }
            } else {
                res.status(404).json({ message: "Invoice not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while updating the invoice" });
        }
    });

    app.listen(serverPort, serverHost, () => {
        console.log(`BossMan server running on ${serverHost}:${serverPort}`)
    });
}


export async function validateAndPay(r_hash : string, credits_requested: number) {
    try {
        
        const response = await axios.post("http://localhost:8090/validate_and_pay", {
            r_hash,
            credits_requested
        });

        switch (response.status) {
            case 200:
                console.log("Request successful:", response.data.message);
                break;
            default:
                console.log("Success but unexpected status code:", response.status, response.data.message);
                break;
        }
        // console.log(response.data);;
        return true;

    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    console.error("Bad request:", error.response.data.message);
                    break;
                case 402:
                    console.error("Insufficient Funds:", error.response.data.message);
                    break;
                case 404:
                    console.error("Invoice not found:", error.response.data.message);
                    break;
                case 500:
                    console.error("Server error:", error.response.data.message);
                    break;
                default:
                    console.error("Unexpected status code", error.response.status, error.response.data.message);
                    break;
            }
            // console.log(error.response.data)
        } else {
            console.error(`Error: ${error.message}`);
        }
        
        return false;
    }
}

async function checkHeaderCallback(req: http.IncomingMessage): Promise<boolean> {
    try {
        const headerName = "lightning_r_hash"
        if (req.headers[headerName]) {
            const r_hash = req.headers[headerName];

            if (typeof r_hash === 'string') {
                const isValid = await validateAndPay(r_hash, 10);
                return isValid;
            } else {
                console.error(`Expected ${headerName} to be a string, but got ${typeof r_hash}`);
                return false;
            }
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}


