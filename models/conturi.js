const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const conturi = sequelize.define('conturi', {
        idCont: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idUtilizator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'utilizator', // Asigură-te că acesta este numele tabelului pentru modelul Utilizator
                key: 'idUtilizator'
            }
        },
        Titular: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 255]
            }
        },
        numeBanca: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                len: [3, 255]
            }
        },
        dataExpirare: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Moneda: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['USD', 'EUR', 'GBP', 'RON']] // Listează monedele acceptate
            }
        },
        IBAN: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [15, 34]
            }
        },
        CIF: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [5, 10]
            }
        },
        SWIFT: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^[A-Z]{6}[A-Z1-9]{2}([A-Z1-9]{3})?$/  // Validează codul SWIFT/BIC
            }
        }
    }, {freezeTableName: true,
        timestamps: false // Nu adăuga automat câmpurile createdAt și updatedAt
    });

    return conturi;
};
