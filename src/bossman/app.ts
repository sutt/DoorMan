import express from "express";
import path from "path";
import { Sequelize, DataTypes }  from "sequelize";
import sqlite3 from "sqlite3";


export function runBossmanServer({
    publicPort = 8090,
    publicHost = "127.0.0.1",
}) {

    const app = express();

    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: path.join("../data/dbs/", "bossman.sqlite"),
    });

    const Invoice = sequelize.define("Invoice", {
        r_hash: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        invoice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        credits_used:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
    });

    app.set("view engine", "ejs");

    app.get("/invoices", async (req, res) => {
        const invoices = await Invoice.findAll();
        res.json(invoices);
        // TODO - error handling
        // res.render("invoices", { invoices });
    });

    // export default app;
    app.listen(publicPort, publicHost, () => {
        console.log(`BossMan server running on ${publicHost}:${publicPort}`)
    });
}