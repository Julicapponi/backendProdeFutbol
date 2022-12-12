const cors = require('cors');
const express = require('express');
const app = express();
//require('./database');

const mysql = require('mysql');
const myconn = require('express-myconnection');

const dbOptions = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'password',
    database: 'prodeFootball'
}

// settings
app.set('port', process.env.PORT || 4000)

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use('/api', require('./routes/index'));
app.use(myconn(mysql, dbOptions, 'single'))

app.listen(app.get('port'));
console.log('Server on port', app.get('port'));
