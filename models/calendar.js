const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const calendar = sequelize.define('calendar', {
        // Definește câmpurile modelului
        IdEveniment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idUtilizator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'utilizator', // Asigură-te că acesta este numele tabelului pentru modelul Utilizator
                key: 'idUtilizator'
            }
        },
        Titlu: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]  // Titlul evenimentului între 1 și 255 de caractere
            }
        },
        Descriere: {
            type: DataTypes.TEXT,
            allowNull: true  // Permite descrierea să fie null
        },
        dataEvenimentStart: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dataEvenimentFinal: {
            type: DataTypes.DATE,
            allowNull: false
        },
        CuloareText: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '#000000'  // Setează o valoare implicită pentru culoarea textului
        },
        CuloareFundal: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '#FFFFFF'  // Setează o valoare implicită pentru culoarea fundalului
        },
        ToataZiuaBool: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false  // Presupune că evenimentul nu este toată ziua
        }
    }, {freezeTableName: true,
        timestamps: false  // Nu adăuga automat câmpurile createdAt și updatedAt
    });

    return calendar;
};
