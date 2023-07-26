import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';




const imageDirectory = path.resolve(__dirname, '..','..','data', 'images');
// Ensure the image directory exists
// if (!fs.existsSync(imageDirectory)) {
//     fs.mkdirSync(imageDirectory);
// }

export async function downloadImage(imageUrl: string): Promise<{dataUri: string, fnLocal: string} | undefined> {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 5000 });
        console.log("downloaded image!");

        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const dataUri = 'data:image/png;base64,' + base64;

        const fnRemote = path.basename(imageUrl);
        const ext = path.extname(fnRemote);
        const fnLocal = uuidv4() + (ext ? ext : '.jpg');
        const imagePath = path.resolve(imageDirectory, fnLocal);

        // fs.writeFileSync(imagePath, response.data);
        fs.writeFile(imagePath, response.data).catch(error => console.error(error));

        return {dataUri, fnLocal};
    } catch (error) {
        console.error(`error in downloadImage: ${error}`);
    }
}




