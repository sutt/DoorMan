import dotenv from "dotenv";
import yargs from "yargs";
import { runDoormanServer } from "./doorman/app";
import { runBossmanServer } from "./bossman/app";

dotenv.config();
console.log(process.env.BOSSMAN)
const argv = yargs(process.argv.slice(2))
    .option("bossman", { type: "boolean" })

const serverType = (argv.bossman || process.env.BOSSMAN === "1")
                    ? "bossman" 
                    : "doorman";

if (serverType === "doorman") {
        
    runDoormanServer({publicPort: 8080});

} else if (serverType === "bossman") {

    runBossmanServer({publicPort: 8090});

}