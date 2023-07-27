import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';




const imageDirectory = path.resolve(__dirname, '..','..','data', 'images');
// Ensure the image directory exists
// if (!fs.existsSync(imageDirectory)) {
//     fs.mkdirSync(imageDirectory);
// }

export async function writeImage(base64Image: string): Promise<string | undefined> {
    try {
        let base64Data: string;
        let fileExtension: string;

        // Check the data URI prefix to determine the file format
        if (base64Image.startsWith('data:image/png;base64,')) {
            base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
            fileExtension = 'png';
        } else if (base64Image.startsWith('data:image/jpeg;base64,')) {
            base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
            fileExtension = 'jpg';
        } else {
            throw new Error('Unsupported data URI format. Only PNG and JPEG are supported.');
        }

        // Convert the base64 string back to binary data
        const data = Buffer.from(base64Data, 'base64');

        // Generate a UUID for the filename
        const id = uuidv4();

        // Use the UUID and file extension to create a filename
        const filename = `${id}.${fileExtension}`;

        const imagePath = path.resolve(imageDirectory, filename);

        // Write the data to a file
        await fs.writeFile(imagePath, data);

        return filename;
    } catch (error) {
        console.error(error);
    }
}

// deprecated, data-uri conversion now performed in bossman
export async function downloadImage(imageUrl: string): Promise<string | undefined> {
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

        return fnLocal;
    } catch (error) {
        console.error(`error in downloadImage: ${error}`);
    }
}




