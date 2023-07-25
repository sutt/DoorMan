import dotenv from "dotenv";
import yargs from "yargs";
import { runDoormanServer } from "./doorman/app";
import { runBossmanServer } from "./bossman/app";

// testing libs
import { validateAndPay } from "./bossman/services/validate";
import { callCreateInvoicePayment } from "./doorman/services/funding";

dotenv.config();

const argv = yargs(process.argv.slice(2))
    .option("bossman", { type: "boolean" })
    .help()
    .argv;

const serverType = (argv.bossman || process.env.BOSSMAN === "1")
                    ? "bossman" 
                    : "doorman";

if (serverType === "doorman") {
        
    runDoormanServer({publicPort: 8080});

} else if (serverType === "bossman") {

    runBossmanServer({publicPort: 7862, serverPort: 8090});

    // funding test client
    // setTimeout( () => {
    //     callCreateInvoicePayment("workerAddr", 12, null)
    //         .then(data => console.log(data))
    //         .catch(err => console.error(err));
    //     }
    // , 5000);

    // validateAndPay example test client
    // const exampleRHash = "7ff822e3058b66fa3db5fa19936bf6c512eaa433c83ea3aba2bdfab6ebf7f95a";
    // setTimeout(() => {validateAndPay(exampleRHash, 10);} , 5000);
    // setTimeout(() => {validateAndPay(exampleRHash, 15);} , 7000);
    // setTimeout(() => {validateAndPay(exampleRHash, 10);} , 9000);

}