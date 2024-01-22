const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('crud_api', 'root', 'sarah@123', {dialect: 'mysql'})

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection to mysql has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};


module.exports = { sq: sequelize, testDbConnection };