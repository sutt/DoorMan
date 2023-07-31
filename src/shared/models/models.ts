import path from "path";
import { Sequelize, DataTypes }  from "sequelize";
import { Model } from "sequelize/types";


export interface InvoiceInstance extends Model {
    r_hash: string;
    invoice_encoded: string;
    amount: number;
    is_paid: boolean;
    credits_used: number;
  }


export interface FundingInstance extends Model {
    id: number;
    worker_addr: string;
    r_hash: string;
    amount: number;
    is_paid: boolean;
    credits_used : number;
  }


export const sequelizeBoss = new Sequelize({
    dialect: "sqlite",
    storage: path.join("src/data/dbs/", "bossman.sqlite"),
    logging: false,
});


export const sequelizeDoor = new Sequelize({
    dialect: "sqlite",
    storage: path.join("src/data/dbs/", "doorman.sqlite"),
    logging: false,
});


export const Invoice = sequelizeBoss.define<InvoiceInstance>("Invoice", {
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
        allowNull: false,
        defaultValue: 0,
    },
});

export const Funding = sequelizeDoor.define<FundingInstance>("Funding", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    worker_addr: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    r_hash: {
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
    credits_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});
