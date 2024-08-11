const { DataTypes } = require("sequelize");
const sequelize = require("../configuration/db/dbpool.conf.js");

const User = sequelize.define(
  "Users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    email_id: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("Admin", "User"),
      allowNull: false,
      defaultValue: "User",
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_mobile_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mobile_otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "tbl_users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["email_id"],
      },
      {
        unique: true,
        fields: ["mobile"],
      },
    ],
  }
);

module.exports = User;
