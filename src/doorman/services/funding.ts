import axios, { AxiosResponse } from 'axios';

interface PaymentResponse {
    payment_hash: string;
    payment_request: string;
    checking_id: string;
    lnurl_response: any;
}

export async function callCreateInvoicePayment(wltInvoiceKey: string, amt: number, hookId: string | null = null): Promise<PaymentResponse | undefined> {
    const endpoint = `http://localhost:8090/funding/create_invoice_payment`; 

    const headers = {
        "Content-Type": "application/json"
    };

    const body = {
        wltInvoiceKey: wltInvoiceKey,
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
