require('dotenv').config();
const { Sequelize } = require('sequelize');

const {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  DB_HOST = 'db',
  DB_PORT = '3306'
} = process.env;

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: false,
  pool: { max: 10, min: 0, acquire: 10000, idle: 10000 },
  dialectOptions: { connectTimeout: 5000 }
});

module.exports = { sequelize };