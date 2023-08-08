import axios, { AxiosResponse } from 'axios';

export interface PaymentResponse {
    payment_hash: string;
    payment_request: string;
    checking_id: string;
    lnurl_response: any;
}

export async function callCreateInvoicePayment(workerAddr: string, amt: number, hookId: string | null = null): Promise<PaymentResponse | undefined> {
    
    // TODO - use workerAddr to point
    // console.log(workerAddr)

    // TODO - get this base + endpoint from config vars
    // This is actually a call to remote server's api
    const endpoint = `http://${workerAddr}/funding/create_invoice_payment`; 


    const headers = {
        "Content-Type": "application/json"
    };

    const body = {
        amt: amt,
        hookId: null,  // for now
    };

    try {
        const response: AxiosResponse = await axios.post(endpoint, body, { headers: headers });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function callCheckInvoicePayment(workerAddr: string, checkingId: string): Promise<boolean> {
    
    // TODO - use workerAddr to point
    // console.log(workerAddr)

    // TODO - get this base + endpoint from config vars
    // This is actually a call to remote server's api
    const endpoint = `http://${workerAddr}/funding/check_invoice_payment/${checkingId}`; 

    const headers = {
        "Content-Type": "application/json"
    };

    try {
        const response: AxiosResponse = await axios.get(endpoint, { headers: headers });
        if (response.data?.paid) {
            return true;
        }
        return false;
    } catch (error) {
        // console.error(error.message);
        return false;
    }
}