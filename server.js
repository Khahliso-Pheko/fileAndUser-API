const express = require('express');
const bodyparser = require('body-parser');
//const MysqlConnection = require('./connection');
const port = process.env.PORT || 3000;
const cors = require('cors');
//const https = require('https');
const path = require('path');
//const fs  = require('fs');

const UsersRoutes = require('./routes/users');
const LoginRoutes = require('./routes/login');
const FileRoutes = require('./routes/filemanagement');






var app = express();


app.use(bodyparser.json({limit: '50mb'}));
app.use(cors());
app.use('/users', UsersRoutes);
app.use('/login', LoginRoutes);
app.use('/files', FileRoutes);





 app.listen(port, () => {
     console.log(`Express server listening on port ${port}`);
   });



