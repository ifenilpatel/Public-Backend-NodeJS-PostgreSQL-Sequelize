const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_TITLE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  pool: {
    max: 100, // Maximum number of connections in the pool
    min: 20, // Minimum number of connections in the pool
    acquire: 60000, // Maximum time (in ms) to wait for a connection to be established
    idle: 10000, // Maximum time (in ms) that a connection can be idle before being released
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to the database has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
