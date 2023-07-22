import path from "path";
import { Sequelize, DataTypes }  from "sequelize";
import { Model } from "sequelize/types";
// import sqlite3 from "sqlite3";

export interface InvoiceInstance extends Model {
    r_hash: string;
    invoice_encoded: string;
    amount: number;
    is_paid: boolean;
    credits_used: number | null;
  }

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join("../data/dbs/", "bossman.sqlite"),
    logging: false,
});

export const Invoice = sequelize.define<InvoiceInstance>("Invoice", {
    r_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    invoice_encoded: {
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