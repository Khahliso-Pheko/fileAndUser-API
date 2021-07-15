const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: '3306',
    password:'1234567890',
    database:'fileAndUserDB',
    multipleStatements: true
    
    });
    
    mysqlConnection.connect((err) => {
        if(!err)
          console.log('DB connection succeded');
        else
          console.log('DB connection failed \n Errorr: '+ JSON.stringify(err,undefined,2));
    });
    
module.exports = mysqlConnection;