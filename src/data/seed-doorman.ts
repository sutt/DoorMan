import { sequelizeDoor, Funding } from "../shared/models/models";
import crypto from "crypto";

async function seedDatabase() {
  
  await sequelizeDoor.sync();

  await Funding.destroy({where: {}});


  const exampleRHash = "7ff822e3058b66fa3db5fa19936bf6c512eaa433c83ea3aba2bdfab6ebf7f95a";
  const exampleRHash2 = "7ff822e3058b66fa3db5fa19936bf6c512eaa433c83ea3aba2bdfab6ebf7f95b";
  
  const genRandomHash = () => crypto.randomBytes(32).toString('hex')

  const fundings = [
    { r_hash: exampleRHash, 
        is_paid: true, 
        amount: 50, 
        credits_used: 10, 
        worker_addr: "127.0.0.1:8090",
    },
    { r_hash: exampleRHash2, 
      is_paid: true, 
      amount: 50, 
      credits_used: 10, 
      worker_addr: "127.0.0.1:8091",
    },
    //   { r_hash: exampleRHash, 
    //     is_paid: true, 
    //     amount: 20, 
    //     credits_used: 10, 
    //     worker_addr: "127.0.0.1:8091",
    // },
    // { r_hash: exampleRHash2, 
    //   is_paid: true, 
    //   amount: 1000, 
    //   credits_used: 10, 
    //   worker_addr: "127.0.0.1:8090",
    // },
    // { r_hash: exampleRHash2, 
    //   is_paid: true, 
    //   amount: 1000, 
    //   credits_used: 10, 
    //   worker_addr: "35.208.27.122:8090",
    // },
    // { r_hash: genRandomHash(), is_paid: false, amount: 50, worker_addr: "99.88.77.66:7861"},

  ];

  for (const funding of fundings) {
    await Funding.create(funding);
  }

  console.log('Doorman `Funding` table seeded!');
}

seedDatabase();
