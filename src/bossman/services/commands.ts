import axios, { AxiosResponse } from 'axios';
import dotenv from "dotenv";
dotenv.config();

const SD_API_BASEURL = process.env.SD_API_BASEURL || "localhost:7861";
const SD_API_VERSION = process.env.SD_API_VERSION || "1.4.1";


export async function callGenerateImage(reqData: {headers: object, body: object}, sdApiEndpoint?: string) {
    const domain = sdApiEndpoint || SD_API_BASEURL
    const endpoint = `http://${domain}/run/predict`;
    
    const { headers, body } = reqData;

    const liteHeaders = {"content-type": "application/json"}
    
    if (SD_API_VERSION == "1.5.1") {
        // different version of the ui use different 
        // fn_index for the txt2img functionality:
        // 1.4.1: 87
        // 1.5.1: 110
        body["fn_index"] = 109
    }
    
    try {
        const response: AxiosResponse = await axios.post(endpoint, body, { headers: liteHeaders });
        const responseData = response.data;
        if (responseData) {
            const responseDataModified : any = await processData(responseData)
            return responseDataModified;
        } else {
            console.error("bossman callGenerateImage(): responseData is undefined");
        }
    } catch (error) {
        console.error(`bossman callGenerateImage(): ${error.message}`);
    }
    return undefined;
}


async function processData(responseData: any) : Promise<object | undefined> {
    let errMsg = "";
    const imgFnOriginal = getImageUrlFromData(responseData)
    if (!imgFnOriginal) {
        errMsg = "getImageUrlFromData returned undefined";
    } else {
        const downloadUrl = `http://${SD_API_BASEURL}/file=${imgFnOriginal}`
        const dataUri = await cvtFnToUri(downloadUrl)
        if (!dataUri) {
            errMsg = "downloadImage returned undefined";
        } else {
            const responseDataModified  = changeImgUrlOnData(responseData, dataUri)
            return responseDataModified;
        }
    }
    console.error(`bossman processData(): ${errMsg}`)
    return undefined;
}


async function cvtFnToUri(imageUrl: string): Promise<string | undefined> {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 5000 });

        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const dataUri = 'data:image/png;base64,' + base64;
        return  dataUri;
    } catch (error) {
        console.error(`error in cvtFnToUri: ${error.message}`);
    }
}


function getImageUrlFromData(data: any): string | undefined {
    try {
        return data.data[0][0].name;
    } catch (error) {
        return undefined;
    }
    return undefined;
}


function changeImgUrlOnData(data: any, imgUri: string, newUrl?: string): any {
    try {
        data.data[0][0].is_file = false
        data.data[0][0].data = imgUri
        if (newUrl) {
            data.data[0][0].name = newUrl;
        } else {
            delete data.data[0][0].name   
        }
        return data;
    } catch (error) {
        return undefined;
    }
    return data;
}
