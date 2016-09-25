var mysql = require('mysql');
var config = require('../config/dbconfig');
var connection = mysql.createConnection(config);

connection.connect();

module.exports = connection; 
