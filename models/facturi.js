const express = require('express');

module.exports = (sequelize, DataTypes) => {
    const facturi = sequelize.define('facturi', {
        idFactura: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idContSursa: {
            type: DataTypes.INTEGER,
            references: {
                model: 'conturi', 
                key: 'idCont'
            }
        },
        idContDestinatie: {
            type: DataTypes.INTEGER,
            references: {
                model: 'conturi', 
                key: 'idCont'
            }
        },
        idSecretar: {
            type: DataTypes.INTEGER,
            allowNull:false
            //sa gasesc o modalitate da lua id ul automat 
        },
        idSolicitare:{  
            type: DataTypes.INTEGER,
            references: {
                model: 'solicitari', 
                key: 'idSolicitare'
            }
            //doar daca Solicitarea are status=acceptat
        },
        suma: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },//pentru ca poate plati doar jum nu toata suma din valoarea bursei
        dataStart: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dataFinal: {
            type: DataTypes.DATE,
            allowNull: false
        },
     
        idStatus: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 3,
            references: {
              model: "status",
              key: "idStatus",
            },
            defaultValue: "3", //F Valoarea implicită pentru status
          },
    }, {freezeTableName: true,
        timestamps: true 
    });

    // // Definirea relațiilor, dacă este necesar
    // Tranzactii.associate = function(models) {
    //     // Relații cu alte modele, dacă există
    // };

    return facturi;
};
