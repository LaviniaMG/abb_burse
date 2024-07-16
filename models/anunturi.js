const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const anunturi = sequelize.define('anunturi', {
     
        idAnunt: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idUtilizator:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
                model: 'utilizator', 
                key: 'idUtilizator'        
            }
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false  
        },
        documentURL: {
            type: DataTypes.STRING,
            allowNull: true  
        },
        dataAnuntStart: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dataAnuntFinal: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false  // Nu adăuga automat câmpurile createdAt și updatedAt
    });

    return anunturi;
};
