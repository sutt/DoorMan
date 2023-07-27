import fs from 'fs/promises';



async function readAndEncodeImage(filename: string): Promise<void> {
    try {
        // Read the file from disk
        const data = await fs.readFile(filename);

        // Convert the data to base64
        const base64Data = data.toString('base64');

        // Log the base64 data
        console.log(base64Data);
    } catch (error) {
        console.error(error);
    }
}

readAndEncodeImage('src/data/images/402.png');