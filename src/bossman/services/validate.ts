import http from "http";
import axios from "axios";

// TODO - remove these
import dotenv from "dotenv";
dotenv.config();
const serverPort = process.env.BOSSMAN_SERVER_PORT || 8090;
const serverHost = process.env.BOSSMAN_SERVER_HOST || "127.0.0.1";

export async function checkHeaderCallback(req: http.IncomingMessage): Promise<boolean> {
    try {
        const headerName = "lightning_r_hash"
        if (req.headers[headerName]) {
            const r_hash = req.headers[headerName];
            if (typeof r_hash === 'string') {
                return await validateAndPay(r_hash, 10);
            } else {
                console.error(`Expected ${headerName} to be a string, but got ${typeof r_hash}`);
            }
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}


export async function validateAndPay(r_hash : string, credits_requested: number) : Promise<boolean> {
    try {
        // TODO - send this to serverPort
        const response = await axios.post(`http://${serverHost}:${serverPort}/validate/validate_and_pay`, {
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
