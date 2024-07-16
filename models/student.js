module.exports = (sequelize, DataTypes) => {
    const student = sequelize.define('student', {
        idFacultate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'facultate',
                key: 'id'
            }
        },
        anFacultate: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
            validate: {
                min: 1,
                max: 4
            }
        },
        media: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0.00,
                max: 10.00
            }
        },
        restanta: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });

    return student;
};
