const mysql = require("mysql2/promise");
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const db = {};
const dbConfig = require("../config/db.json");
const basename = path.basename(module.filename);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: "mysql",
    host: dbConfig.host,
 }
);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import modele
db.tipUtilizator = require('./tipUtilizator')(sequelize, Sequelize);
db.status = require('./status')(sequelize, Sequelize);
db.tipBursa = require('./tipBursa')(sequelize, Sequelize);
db.semestru = require('./semestru')(sequelize, Sequelize);
db.utilizator = require('./utilizator')(sequelize, Sequelize);
db.student = require('./student')(sequelize, Sequelize);
db.anunturi = require('./anunturi')(sequelize, Sequelize);
db.calendar = require('./calendar')(sequelize, Sequelize);
db.conturi = require('./conturi')(sequelize, Sequelize);
db.facturi = require('./facturi')(sequelize, Sequelize);
db.solicitari = require('./solicitari')(sequelize, Sequelize);
db.facultate = require('./facultate')(sequelize, Sequelize);

// Definirea relațiilor
// Utilizatori
db.utilizator.hasMany(db.anunturi, { foreignKey: 'idUtilizator' });
db.utilizator.hasMany(db.calendar, { foreignKey: 'idUtilizator' });
db.utilizator.hasMany(db.conturi, { foreignKey: 'idUtilizator', as:'conturi' });
db.utilizator.hasMany(db.solicitari, { foreignKey: 'idUtilizator' , as:'solicitari'});
db.utilizator.hasOne(db.student, { foreignKey: 'idUtilizator' });

// Studenți
db.student.belongsTo(db.utilizator, { foreignKey: 'idUtilizator' });

// Anunțuri
db.anunturi.belongsTo(db.utilizator, { foreignKey: 'idUtilizator' });

// Calendar
db.calendar.belongsTo(db.utilizator, { foreignKey: 'idUtilizator' });

// Conturi
db.conturi.belongsTo(db.utilizator, { foreignKey: 'idUtilizator' , as: 'utilizator'});
db.conturi.hasMany(db.facturi, { as: 'FacturiSursa', foreignKey: 'idContSursa' });
db.conturi.hasMany(db.facturi, { as: 'FacturiDestinatie', foreignKey: 'idContDestinatie' });

// Facturi
db.facturi.belongsTo(db.conturi, { as: 'ContSursa', foreignKey: 'idContSursa' });
db.facturi.belongsTo(db.conturi, { as: 'ContDestinatie', foreignKey: 'idContDestinatie' });
db.facturi.belongsTo(db.solicitari, { foreignKey: 'idSolicitare' , as: 'solicitari'});

// Solicitări
db.solicitari.belongsTo(db.utilizator, { foreignKey: 'idUtilizator' , as:'utilizator'});
db.solicitari.belongsTo(db.status, { foreignKey: 'idStatus' });
db.solicitari.belongsTo(db.tipBursa, { foreignKey: 'idBursa' });


// Facultati
db.facultate.hasMany(db.student, { foreignKey: 'idFacultate' });
db.student.belongsTo(db.facultate, { foreignKey: 'idFacultate' });

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexiunea a fost stabilită cu succes.");
  })
  .catch((err) => {
    console.error("Eroare la conectare:", err);
  });

module.exports = db;

