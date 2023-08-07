import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { validateAndPay } from '../services/validate';
import { callGenerateImage as realCallGenerateImage } from '../services/commands';
import mockResponseBossman from "../../data/mock-data/mock.response.bossman.mock.1.json";

const mockCallGenerateImage = async (reqData) => {
    return mockResponseBossman;
};

const MOCK_BOSSMAN_GENERATE = process.env.MOCK_BOSSMAN_GENERATE == "1";

const callGenerateImage = MOCK_BOSSMAN_GENERATE 
                            ? mockCallGenerateImage 
                            : realCallGenerateImage;


const router = createRouter(callGenerateImage);

export default router;

function createRouter(callGenerateImage) {
    const router = express.Router();

    router.post('/generate/image', async (req: Request, res: Response) => {

        let errMsg = "";
        let statusCode = 500;
        
        // Check payment before proceeding
        let isValidated = false;    
        try {
            const headerName = "lightning_r_hash"
            if (req.headers[headerName]) {
                
                const r_hash = req.headers[headerName].toString();
                isValidated = await validateAndPay(r_hash, 10);
                
                if (!isValidated) {
                    errMsg = "Payment failed.";
                    statusCode = 402;
                }
            } else {
                errMsg = "Expected lighting_r_hash header to be present.";
                statusCode = 400;
            }
        } catch (error) {
            errMsg = `exception on checkPayment proc: ${error.message}`;
            statusCode = 501;
        }

        // Main Service Call
        if (isValidated) {
            try {
                const reqData = req.body;
                
                const jsonData = await callGenerateImage(reqData)
                
                if (jsonData) {
                    // console.log(jsonData)
                    res.json(jsonData);
                    return;
                } else {
                    errMsg = "no json data from callGenerateImage";
                    statusCode = 404;
                }
            } catch (error) {
                errMsg = `exception on callGenerateImage: ${error.message}`;
                statusCode = 500;
            }
        }
        // Or, send back error reponse
        console.error(`bossman /generate/image: ${errMsg}`);
        res.status(statusCode).json({ error: errMsg });
        return;
    });
    
    return router;
}