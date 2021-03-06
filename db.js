const Sequelize = require("sequelize");


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    port: 3306,
    define: {
        timestamps: false
    }
});

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.predmet_student = sequelize.import(__dirname + '/models/predmet_student.js');
db.AkademskaGodina = sequelize.import(__dirname + '/models/AkademskaGodina.js');
db.Korisnik = sequelize.import(__dirname + '/models/Korisnik.js');

db.Odsjek = sequelize.import(__dirname + '/models/Odsjek.js');
db.odsjek_predmet = sequelize.import(__dirname + '/models/odsjek_predmet');

db.ZahtjeviZavrsni = sequelize.import(__dirname + '/models/ZahtjeviZavrsni.js');
db.TemeZavrsnih = sequelize.import(__dirname + '/models/TemeZavrsnih.js');

db.Ispit = sequelize.import(__dirname + '/models/Ispit.js');
db.IspitBodovi = sequelize.import(__dirname + '/models/IspitBodovi.js');

db.Ugovori = sequelize.import(__dirname + '/models/Ugovori.js');

db.student_zadatak = sequelize.import(__dirname + '/models/student_zadatak.js');
db.Zadatak = sequelize.import(__dirname + '/models/Zadatak.js');
db.Zadaca = sequelize.import(__dirname + '/models/Zadaca.js');
module.exports = db;
