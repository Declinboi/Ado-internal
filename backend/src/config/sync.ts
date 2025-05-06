// src/db/sequelize.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/userModel';



export const sequelize = new Sequelize({
  database: process.env.PG_DATABASE,
  dialect: 'postgres',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  models: [User], // path to model files
  logging: false, // disable SQL logs
});
