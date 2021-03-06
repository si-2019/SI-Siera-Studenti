var express = require('express');
var router = express.Router();
const db = require('../db.js');
const axios = require('axios');

//Lista svih ocjena po studentu
router.get('/:idStudenta', function (req, res) {

    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudenta + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudenta + '/pregled-statistike')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {

                                const studnet_id = req.params.idStudenta;


                                var ocjeneniz = []
                                var brojac = 0;

                                db.Korisnik.count({
                                    where:
                                    {
                                        id: studnet_id
                                    }
                                }).then(broj => {
                                    if (broj == 0) {
                                        return res.status(404).send({
                                            userAutorizacija: true,
                                            success: false,
                                            message: 'Parameter idStudent not found'
                                        });
                                    }
                                    else {
                                        db.sequelize.query("SELECT DISTINCT predmet_student.idAkademskaGodina, AkademskaGodina.naziv FROM predmet_student, AkademskaGodina WHERE predmet_student.idStudent=" + studnet_id + " AND predmet_student.idAkademskaGodina = AkademskaGodina.id ORDER BY AkademskaGodina.naziv").then(([godine, metadata]) => {
                                            for (var i = 0; i < godine.length; i++) {

                                                var ak_id = godine[i].idAkademskaGodina



                                                db.sequelize.query("SELECT Predmet.naziv AS Predmet, predmet_student.ocjena AS Ocjena FROM Predmet, predmet_student WHERE predmet_student.idStudent=" + studnet_id + " AND Predmet.id=predmet_student.idPredmet AND predmet_student.idAkademskaGodina=" + ak_id).then(([ocjene, metadata]) => {

                                                    ocjeneniz.push([{
                                                        AkademskaGodina: godine[brojac].naziv,
                                                        Ocjene: []

                                                    }])

                                                    for (var j = 0; j < ocjene.length; j++) {
                                                        ocjeneniz[brojac][0].Ocjene.push({
                                                            Predmet: ocjene[j].Predmet,
                                                            Ocjena: ocjene[j].Ocjena
                                                        })
                                                    }
                                                    brojac++
                                                    if (brojac == godine.length) {
                                                        res.status(200).json({
                                                            userAutorizacija: true,
                                                            success: true,
                                                            ocjene: ocjeneniz
                                                        })
                                                    }

                                                })
                                            }


                                        })

                                    }

                                })

                            }
                            catch (e) {
                                console.log("Backend error: " + e);
                                res.status(400).json({
                                    userAutorizacija: true,
                                    success: false,
                                    error: e
                                })
                            }
                        }
                        //Nema privilegiju
                        else {
                            res.json({
                                userAutorizacija: false,
                                success: false,
                                message: "Nema privilegiju"
                            })
                        }
                        //error privilegija
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            userAutorizacija: false,
                            success: false
                        })
                    })
            }
            //Ne postoji id
            else {
                res.json({
                    userAutorizacija: false,
                    success: false,
                    message: "Ne postoji id"
                })
            }
        })
        // error uloga
        .catch(error => {
            console.log(error);
            res.json({
                userAutorizacija: false,
                success: false
            })
        });

});

router.get('/:idStudenta/sort', function (req, res) {

    axios.get('http://si2019oscar.herokuapp.com/pretragaId/' + req.params.idStudenta + '/dajUlogu')
        .then(response => {
            //Ako nije null, ima ulogu
            if (response.data != null) {
                axios.get('http://si2019oscar.herokuapp.com/pretragaId/imaPrivilegiju/' + req.params.idStudenta + '/pregled-statistike')
                    .then(response => {
                        //Prosla autorizacija
                        if (response.data == true) {
                            try {

                                const student_id = req.params.idStudenta;
                                var sort = [];
                                var objekat;
                                db.Korisnik.count({
                                    where:
                                    {
                                        id: student_id
                                    }
                                }).then(broj => {
                                    if (broj == 0) {
                                        return res.status(404).send({
                                            userAutorizacija: true,
                                            success: false,
                                            message: 'Korisnik not found'
                                        });
                                    }
                                    else {
                                        db.sequelize.query("SELECT Predmet.naziv, predmet_student.ocjena FROM Predmet, predmet_student WHERE predmet_student.idStudent=" + student_id + " AND predmet_student.idPredmet = Predmet.id ORDER BY predmet_student.ocjena, Predmet.naziv").then(([predmeti, metadata]) => {
                                            if (predmeti.length == 0) {
                                                return res.status(200).send({
                                                    userAutorizacija: true,
                                                    succes: true,
                                                    message: 'Korisnik nije upisao ni jednu ocjenu',
                                                });
                                            }
                                            for (var i = 0; i < predmeti.length; i++) {
                                                if (predmeti[i].ocjena == null) {
                                                    continue;
                                                }
                                                else {
                                                    objekat = { naziv: predmeti[i].naziv, ocjena: predmeti[i].ocjena };
                                                    sort.push(objekat);
                                                }
                                                if (i == predmeti.length - 1) {
                                                    return res.status(200).send({
                                                        userAutorizacija: true,
                                                        succes: true,
                                                        message: 'Succesful',
                                                        ocjene: sort
                                                    })
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            catch (e) {
                                console.log("Backend error: " + e);
                                res.status(400).json({
                                    userAutorizacija: true,
                                    success: false,
                                    error: e
                                })
                            }
                        }
                        //Nema privilegiju
                        else {
                            res.json({
                                userAutorizacija: false,
                                success: false,
                                message: "Nema privilegiju"
                            })
                        }
                        //error privilegija
                    }).catch(error => {
                        console.log(error);
                        res.json({
                            userAutorizacija: false,
                            success: false
                        })
                    })
            }
            //Ne postoji id
            else {
                res.json({
                    userAutorizacija: false,
                    success: false,
                    message: "Ne postoji id"
                })
            }
        })
        // error uloga
        .catch(error => {
            console.log(error);
            res.json({
                userAutorizacija: false,
                success: false
            })
        });


});

module.exports = router;