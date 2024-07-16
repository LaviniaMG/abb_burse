const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const status = sequelize.define('status', {
        idStatus: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        denumire: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 255] 
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false 
    });

    return status;
};
