const { DataTypes } = require("sequelize");
const sequelize = require("../configuration/db/dbpool.conf.js");

sequelize.sync({ force: true }).then(() => {
  console.log("Database synced");
});

const Department = sequelize.define(
  "Departments",
  {
    departmentid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdby: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tbldepartments",
    timestamps: true,
    createdAt: "createdat",
    updatedAt: "updatedat",
    indexes: [
      {
        unique: true,
        fields: ["title"],
      },
    ],
  }
);

module.exports = Department;
