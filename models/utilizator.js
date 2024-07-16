
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const utilizator = sequelize.define('utilizator', {
        idUtilizator: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CNP: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          
        },
        Nume: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Prenume: {
            type: DataTypes.STRING,
            allowNull: false
        },
        InitialaTata: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Telefon: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[0-9]+$/ // numai cifre
            }
        },
        URLPoza: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
    
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        Parola: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('Parola', hashedPassword);
            }
        },
        idTipUtilizator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tipUtilizator', 
                key: 'idUtilizator'        
            }
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });

    utilizator.prototype.verificaParola = function(parola) {
        return bcrypt.compareSync(parola, this.Parola);
    };

    return utilizator;
};
//de modificat legaturile!!