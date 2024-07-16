const express = require('express');

module.exports = (sequelize, DataTypes) => {
    var semestru = sequelize.define('semestru', {
        idSemestru: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        dataStart: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dataFinal: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false // Nu adăugați automat câmpurile createdAt și updatedAt
    });

    return semestru;
};
// Calculul Plății Finale:

// Dacă data ultimei tranzacții se află înainte de dataFinal a semestrului, 
//calculați numărul de zile între ultima tranzacție și dataFinal pentru a determina 
//dacă este necesară o plată parțială.
// Dacă ultima tranzacție coincide sau depășește dataFinal,
// se consideră că plata pentru luna respectivă este integrală.