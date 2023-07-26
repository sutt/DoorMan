import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';


const router = express.Router();

router.post('/generate/image', async (req: Request, res: Response) => {

    // grab the header and check payment
    
    const { headers, body } = req.body;
    console.log(headers);
    console.log(body);
    
    const endpoint = "http://localhost:7861/run/predict";
    
    try {
        const response: AxiosResponse = await axios.post(endpoint, body, { headers: headers });
        res.json(response.data);
    } catch (error) {
        console.error(`error calling sd: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
    

});

export default router;