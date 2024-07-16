const express = require("express");

module.exports = (sequelize, DataTypes) => {
  const solicitari = sequelize.define(
    "solicitari",
    {
      idSolicitare: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      dataAplicare: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      DocumentURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idStatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3,
        references: {
          model: "status",
          key: "idStatus",
        },
      },
      dataModificareStatus: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      platit: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      denumireBursa: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      hooks: {
        beforeValidate: (solicitare, options) => {
          if (solicitare.idStatus !== 1) {
            solicitare.platit = false; 
          }
        }
      }
    }
  );

  return solicitari;
};
