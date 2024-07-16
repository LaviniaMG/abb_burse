const { facturi, solicitari,student, utilizator,semestru, tipBursa } = require("../models");
const moment = require('moment');
const FacturiController = {
  create(req, res) {
    const {
      idContDestinatie,
      tipBursaId,
      dataStart,
      dataFinal,
      idStatus
    } = req.body;
  
    let idContSursa = 2;
    let idSecretar = 2;
  
    tipBursa.findByPk(tipBursaId)
      .then((bursa) => {
        if (!bursa) {
          console.error("Tipul de bursă nu a fost găsit.");
          return res.status(404).send({ message: "Tipul de bursă nu a fost găsit." });
        }
  
        solicitari.findAll({
          where: { idBursa: tipBursaId, idStatus: 1 },
        })
          .then((aplicanti) => {
            if (aplicanti.length === 0) {
              console.error("Nu există aplicanți eligibili pentru acest tip de bursă.");
              return res.status(404).send({ message: "Nu există aplicanți eligibili pentru acest tip de bursă." });
            }
  
            semestru.findOne({ where: { idSemestru: 1 } }) // Assume idSemestru is known, or adjust accordingly
              .then((semestru) => {
                if (!semestru) {
                  console.error("Semestrul nu a fost găsit.");
                  return res.status(404).send({ message: "Semestrul nu a fost găsit." });
                }
  
                const calculeazaSuma = (dataStartFactura, dataFinalFactura) => {
                  const start = moment(dataStartFactura);
                  const end = moment(dataFinalFactura);
  console.log('start',start.date())
                  const startSemestru = moment(semestru.dataStart);
                  const endSemestru = moment(semestru.dataFinal);
  
                  let sumaTotala = 0;
  
                  if (start.isSame(startSemestru, 'month')) {
                    const zileLuna = parseInt(start.daysInMonth(), 10);
                    console.log('zile luna:', zileLuna);
                    const zileActive = parseInt(zileLuna - startSemestru.date() + 1, 10);
                    console.log('zile active:', zileActive);
                    sumaTotala += parseFloat((bursa.cuantum / zileLuna) * zileActive);
                  } else if (start.isAfter(startSemestru)) {
                    sumaTotala = parseFloat(bursa.cuantum);
                  }
                  if (start.isSame(endSemestru, 'month')) {
                    const zileLuna = parseInt(start.daysInMonth(),10);
                    const zileActive = parseInt(endSemestru.date() - start.date() + 1,10);
                    sumaTotala += parseFloat((bursa.cuantum / zileLuna) * zileActive);
                }else if (start.isAfter(endSemestru)) {
                  sumaTotala = parseFloat(bursa.cuantum);
                }
                  return sumaTotala;
                };
  
                const createFacturiPromises = aplicanti.map((aplicant) => {
                  const sumaCalculata = calculeazaSuma(dataStart, dataFinal);
                  return facturi.create({
                    idContSursa,
                    idContDestinatie,
                    idSecretar,
                    idSolicitare: aplicant.idSolicitare,
                    suma: sumaCalculata,
                    dataStart,
                    dataFinal,
                    idStatus
                  })
                    .then(() => {
                      return solicitari.update(
                        { platit: true }, 
                        { where: { idBursa: tipBursaId } }
                      );
                    })
                    .catch(error => {
                      console.error("Eroare la crearea facturii sau actualizarea solicitării:", error);
                      throw error;
                    });
                });
  
                Promise.all(createFacturiPromises)
                  .then(() => {
                    res.status(201).send({ message: "Facturi au fost create și actualizate cu succes pentru toți aplicanții eligibili." });
                  })
                  .catch(error => {
                    console.error("Eroare la crearea și actualizarea facturilor:", error);
                    res.status(500).send({ message: "A apărut o eroare la crearea și actualizarea facturilor." });
                  });
              })
              .catch((error) => {
                console.error("Eroare la găsirea semestrului:", error);
                res.status(400).send({ message: "Eroare la găsirea semestrului.", details: error.message });
              });
          })
          .catch((error) => {
            console.error("Eroare la găsirea solicitărilor:", error);
            res.status(400).send({ message: "Eroare la găsirea solicitărilor.", details: error.message });
          });
      })
      .catch((error) => {
        console.error("Eroare la găsirea tipului de bursă:", error);
        res.status(400).send({ message: "Eroare la găsirea tipului de bursă.", details: error.message });
      });
  },
  // Căutarea tuturor facturilor
  findAll(req, res) {
    facturi.findAll({
      include: [
        {
          model: solicitari,
          as: 'solicitari',
          include: [
            {
              model: utilizator,
              as: 'utilizator'
        
            }
          ]
        }
      ]
    })
    .then((facturi) => res.status(200).send(facturi))
    .catch((error) => res.status(400).send(error));
  },

  // Căutarea unei facturi după ID
  findById(req, res) {
    const id = req.params.id;
    facturi
      .findByPk(id)
      .then((factura) => {
        if (!factura) {
          return res.status(404).send({ message: "Factura nu a fost găsită." });
        }
        res.status(200).send(factura);
      })
      .catch((error) => res.status(400).send(error));
  },

  // Actualizarea unei facturi
  update(req, res) {
    const id = req.params.id;
    const updates = req.body;
    facturi
      .update(updates, { where: { idFactura: id } })
      .then((num) => {
        if (num == 1) {
          res.send({ message: "Factura a fost actualizată cu succes." });
        } else {
          res.send({
            message: `Nu se poate actualiza factura cu id=${id}. Poate factura nu a fost găsită sau req.body este gol!`,
          });
        }
      })
      .catch((error) => res.status(400).send(error));
  },

  // Ștergerea unei facturi
  delete(req, res) {
    const id = req.params.id;
    facturi
      .destroy({ where: { idFactura: id } })
      .then((num) => {
        if (num == 1) {
          res.send({ message: "Factura a fost ștearsă cu succes!" });
        } else {
          res.send({
            message: `Nu se poate șterge factura cu id=${id}. Poate factura nu a fost găsită!`,
          });
        }
      })
      .catch((error) => res.status(400).send(error));
  },
};

module.exports = FacturiController;
