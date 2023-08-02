import { sequelizeBoss, Invoice } from "../shared/models/models";
import crypto from "crypto";

async function seedDatabase() {
  
  await sequelizeBoss.sync();

    await Invoice.destroy({where: {}});
  

  const exampleRHash = "7ff822e3058b66fa3db5fa19936bf6c512eaa433c83ea3aba2bdfab6ebf7f95a";
  const exampleRHash2 = "7ff822e3058b66fa3db5fa19936bf6c512eaa433c83ea3aba2bdfab6ebf7f95b";
  const exampleInvoiceEncoded = "lnbc100n1pjth7c6pp5raxkvuhsrw0qv2sga56866g8zn54wunsjj5yw4wu50022us025aqdqcv4uxzmtsd3jjq6twwehkjcm9cqzzsxqzjcsp5ljx9guv7ra8wf4q8zmtpajek68l6v72zpnkuvjvpn7wj0cu6t5zs9qyyssq7mzxa0uhyj86tt6p82vkkwr6yfr2mzermwux7xw5vrdh66qnunh99vyyahlud78egltf78an52sm7dpye4qu9058ntdgjgvxj8execgp8pssqh"
  
  const genRandomHash = () => crypto.randomBytes(32).toString('hex')

  // Romulus Rhash, Remus Rhash2
  const invoices = [
    { r_hash: exampleRHash, 
        is_paid: true, 
        amount: 1000, 
        credits_used: 10, 
        invoice_encoded: exampleInvoiceEncoded 
    },
    // { r_hash: exampleRHash2, 
    //   is_paid: true, 
    //   amount: 30, 
    //   credits_used: 10, 
    //   invoice_encoded: exampleInvoiceEncoded 
    // },
    // { r_hash: exampleRHash2, 
    //   is_paid: true, 
    //   amount: 1000, 
    //   credits_used: 10, 
    //   invoice_encoded: exampleInvoiceEncoded 
    // },
    // { r_hash: genRandomHash(), is_paid: false, amount: 50, invoice_encoded: exampleInvoiceEncoded },
    // { r_hash: genRandomHash(), is_paid: true, amount: 10, credits_used: 0, invoice_encoded: exampleInvoiceEncoded },
    // { r_hash: genRandomHash(), is_paid: true, amount: 10, credits_used: 10, invoice_encoded: exampleInvoiceEncoded },
    
  ];

  for (const invoice of invoices) {
    await Invoice.create(invoice);
  }

  console.log('Bossman `Invoice` table seeded!');
}

seedDatabase();
