const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const tipUtilizator = sequelize.define('tipUtilizator', {
        idUtilizator: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        denumire: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 100] 
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false 
    });

    return tipUtilizator;
};
