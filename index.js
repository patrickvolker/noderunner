require('dotenv').config();
const express = require('express');
const mysql =  require('mysql');
const app = express();
const cors = require('cors');
const dbHost = process.env.dbHost;
const dbUser = process.env.dbUser;
const dbPassword = process.env.dbPassword;
const dbJaws = process.env.dbJaws;
const dbPort = process.env.dbPort;
const PORT = process.env.PORT;

app.use(cors());
//jawsdb
if (process.env.JAWSDB_URL){
    var db = mysql.createConnection(process.env.JAWSDB_URL);
}
//or local connection
// var db = mysql.createConnection({
//     host: dbHost,
//     user: dbUser,
//     password: dbPassword,
//     database: dbJaws,
//     port: (dbPort || 5000)
// });

app.use(express.urlencoded({
    extended: true
})
)
app.use(express.json());

//connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySQL connected!');
});

//need to learn how to do these routes with jawsDB (or just anything) (http://localhost:5000/stats)
app.get('/stats', (req, res) => {
    const sql = 'SELECT * FROM `stats`';
    db.query(sql, (err, result) => {
        if (err) throw 'Something bad happened...sorry...';
        res.send(result);
    });
});

app.get('/stats/run_total', (req, res) => {
    const sql = 'SELECT run_total FROM `stats` WHERE run_total ORDER BY id DESC LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) throw 'Something bad happened...sorry...';
        res.send(result);
    });
});

app.post('/stats', (req, res) => {
    //get values from req
    let run_date = req.body.run_date;
    let run_length = req.body.run_length;
    let run_total = req.body.run_total;
       //plug values into sql
       const sql = 'INSERT INTO `stats` (run_date, run_length, run_total) VALUES ("' + run_date + '", ' + run_length + ', ' + run_total + ')';
        console.log(sql);
        db.query(sql, (err, result) => {
        if (err) throw 'Something bad happened...sorry...';
        res.send(result);
        console.log('Run posted!');
    });
});

app.listen((process.env.PORT), () => console.log('Online!'));


//sql line for inserting new run ---> INSERT INTO `stats` (`id`, `run_date`, `run_length`, `run_total`) VALUES (NULL, '2021-01-08', '6', '48');
//sql line for just getting most recent run_total 'SELECT run_total FROM stats WHERE run_total ORDER BY id DESC LIMIT 1'