import express, { Request, Response } from 'express';
import { Invoice } from '../../shared/models/models';

const router = express.Router();

router.post("/validate_and_pay", async (req, res) => {
    try {
        const { r_hash, credits_requested } = req.body;
        if (!r_hash || !credits_requested) {
            return res.status(400).json({ message: "r_hash and credits_requested must be provided" });
        }

        const invoice = await Invoice.findByPk(r_hash);
        if (invoice) {
            const available_credits = invoice.amount - invoice.credits_used;
            if (credits_requested > available_credits) {
                res.status(402).json({ message: "Not enough available credits", invoice: [invoice] });
            } else {
                invoice.credits_used += credits_requested;
                await invoice.save();
                res.json({ message: "Request successful", invoice: [invoice] });
            }
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while processing the request" });
    }
});

export default router;