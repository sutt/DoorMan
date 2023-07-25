import axios, { AxiosResponse } from 'axios';
import dotenv from "dotenv";
dotenv.config();

const LNBITS_BASE_URL = process.env.LNBITS_BASE_URL;

// turn on later for webhook
const REMOTE_BASE_URL = process.env.REMOTE_BASE_URL;

export interface CreateInvoiceResponse {
    payment_hash: string;
    payment_request: string;
    checking_id: string;        // usually same as hash, wat diff?
    lnurl_response: any;        // ususally null (?)
}

export interface CheckInvoiceResponse {
    paid: boolean;
}

export async function createInvoicePayment(wltInvoiceKey: string, amt: number, hookId: string | null = null): Promise<CreateInvoiceResponse | undefined> {
    
    // TODO - this is for LNBits incoives, but there are other wallets
    const endpoint = `${LNBITS_BASE_URL}/api/v1/payments`;

    const headers = {
        "X-Api-Key": wltInvoiceKey,
        "Content-Type": "application/json"
    };

    const webhookUrl = `${REMOTE_BASE_URL}/invoice_payment_hook`;

    const body = {
        "out":      false,
        "amount":   amt,
        "memo":     `${amt} sats for generate tokens`,
        "unit":     "sat",
        "webhook":  webhookUrl
    };

    try {
        const response: AxiosResponse = await axios.post(endpoint, body, { headers: headers });
        console.log(response.status)
        if (response.status.toString().startsWith("2")) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}

export async function checkInvoicePayment(wltInvoiceKey: string, checkingId: string): Promise<CheckInvoiceResponse | undefined> {
    const endpoint = `${LNBITS_BASE_URL}/api/v1/payments/${checkingId}`;

    const headers = {
        "X-Api-Key": wltInvoiceKey,
        "Content-Type": "application/json"
    };

    try {
        const response: AxiosResponse = await axios.get(endpoint, { headers: headers });
        if ((response.status.toString().startsWith("2")) 
             && (response.data.paid)
            ) {
                return {paid: response.data.paid};
            }
    } catch (error) {
        // TODO - handle 404
        console.error(error.message);
    }
}
