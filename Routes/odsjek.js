var express = require('express');
var router = express.Router();
const db = require('../db.js');

router.get('/', function (req, res, next) {
    try {

        db.Odsjek.findAll().then(odsjeci => {
            res.status(200).send({
                success: true,
                odsjeci: odsjeci
            })
        })
    }
    catch (e) {
        console.log("Backend error: " + e);
        res.status(400).json({
            success: false,
            error: e
        })
    }

});

module.exports = router;