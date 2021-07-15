const express = require('express');
const router = express.Router();
const MysqlConnection = require('../connection');




/****
 Authenticate a user
 */

router.post('/', (req,res) => {
  var email = req.body.email;
  var password = req.body.password;
  console.log(req.body);
  var sql = "SELECT * FROM user WHERE email = ?";

  MysqlConnection.query(sql, [email],(err, rows, fields) =>{
    if (err) {
      console.log(err);
        res.json({
          status:false,
          message:'there are some error with query'
          })
    }

    else{
        if(rows.length >0){
            if(password==rows[0].password){
             
                res.json({
                    status:true,
                    message:'successfully authenticated',
                    id: rows[0].id,
                    email: rows[0].email,
                    password: rows[0].password,
                    name: rows[0].name
                    
                });
            }
            else{
                res.json({
                  status:false,
                  message:"username and password do not match"
                 });
            }
         
        }
        else{
            res.json({
                status:false,    
                message:"username does not exits"
            });
            
          }
     
    }


  })
});

 module.exports = router;