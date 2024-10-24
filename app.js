var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser')

const user_router = require('./api/user');
const rider_router = require('./api/rider');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use("/user",user_router);
app.use("/rider",rider_router);

module.exports = app; //เอาใช้ server อื่นได้