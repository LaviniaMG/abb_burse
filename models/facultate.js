const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const facultate = sequelize.define('facultate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        facultate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        specializare: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });

    return facultate;
};
