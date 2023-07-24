import express from "express";
import { Invoice } from "../../shared/models/models";
// import { Request, Response }  from "express";


const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving invoices", error: error });
    }
});


router.get("/:r_hash", async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.r_hash);
        if (invoice) {
            if (!invoice.is_paid) {
                res.status(402).json({ message: "Invoice exists, not paid yet.", invoice: [invoice] });
                return 
            } else if  ((invoice.is_paid) && (invoice.credits_used >= invoice.amount)) {
                res.status(402).json({ message: "Invoice exists, but no credits left", invoice: [invoice] });
                return
            } else {
                res.status(200).json({message: "Invoice exists, has available credits", invoice: [invoice]});
                return
            }
        } else {
            res.status(404).json({ message: "Invoice not found" });
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the invoice" });
    }
});

router.post("/", async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the invoice" });
    }
});


router.put("/invoices/:r_hash", async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.r_hash);
        if (invoice) {
            if ("credits_requested" in req.body) {
                const available_credits = invoice.amount - invoice.credits_used;
                if (req.body.credits_requested > available_credits) {
                    res.status(400).json({ message: "Not enough available credits" });
                } else {
                    invoice.credits_used += req.body.credits_requested;
                    await invoice.save();
                    res.json(invoice);
                }
            } else {
                res.status(400).json({ message: "No credits requested data provided" });
            }
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the invoice" });
    }
});

export default router;