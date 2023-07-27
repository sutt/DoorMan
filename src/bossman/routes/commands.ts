import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { callGenerateImage } from '../services/commands';

const router = express.Router();

router.post('/generate/image', async (req: Request, res: Response) => {

    let errMsg = "";
    let statusCode = 500;
    
    // Check payment before proceeding
    // try {
    //     1+1
    // } catch (error) {
    //     errMsg = error.message
    //     statusCode = 402;
    // }
    
    // Main Call
    try {
        const reqData = req.body;
        
        const jsonData = await callGenerateImage(reqData)
        
        if (jsonData){
            res.json(jsonData);
            return;
        } else {
            errMsg = "no json data from callGenerateImage";
            statusCode = 404;
        }
    } catch (error) {
        errMsg = error.message
        statusCode = 500;
    }
    console.error(`bossman /generate/image: ${errMsg}`);
    res.status(statusCode).json({ error: errMsg });
    return;
});

export default router;