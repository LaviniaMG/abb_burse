var db = require("./models/index");
var anunturis = require("./data/anunturi.json");
var calendars = require("./data/calendar.json");
var conturis = require("./data/conturi.json");
var semestrus = require("./data/semestru.json");
var statuss = require("./data/status.json");
var tipBursas = require("./data/tipBursa.json");
var tipUtilizators = require("./data/tipUtilizator.json");
var utilizators = require("./data/utilizator.json");
var students = require("./data/student.json"); 
var facultatis=require("./data/facultati.json")

db.sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("Tabelele au fost create");
    for (const tipU of tipUtilizators) {
        await db.tipUtilizator.create(tipU);
    }
    for (const stat of statuss) {
        await db.status.create(stat);
    }
    for (const tipB of tipBursas) {
        await db.tipBursa.create(tipB);
    }
    for (const sem of semestrus) {
        await db.semestru.create(sem);
    }
    for (const util of utilizators) {
        await db.utilizator.create(util);
    }
    for (const facu of facultatis) {
        await db.facultate.create(facu);
    }
    for (const student of students) { 
        await db.student.create(student);
    }
    for (const anunt of anunturis) {
        await db.anunturi.create(anunt);
    }
  
    for (const cal of calendars) {
        await db.calendar.create(cal);
    }
    for (const cont of conturis) {
        await db.conturi.create(cont);
    }
  })
  .catch((err) => {
    console.log("Tabelele nu au putut fi create! " + err);
  });
