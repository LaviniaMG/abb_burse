const express = require("express");

module.exports = (sequelize, DataTypes) => {
  const tipBursa = sequelize.define(
    "tipBursa",
    {
      idBursa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      denumire: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 100],
          // ENUMERATIE: Puteți adăuga o enumerare dacă aveți un set definit de denumiri posibile.
        },
      },
      cuantum: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      bugetBursa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      bugetTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      dataStart: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dataFinal: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nrBursieri: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return tipBursa;
};
