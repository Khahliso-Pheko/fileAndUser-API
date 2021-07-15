const express = require('express');
const router = express.Router();
const MysqlConnection = require('../connection');

/****
 get all users
 */

router.get('/',(req,res)=>{
 MysqlConnection.query('select * from user',(err,rows,fields)=>{
    if(!err)
      res.send(rows);
    else  {
    console.log(err);
    res.send(err);
    }
 })
});

/****
 get user by id
 */

router.get('/:id', (req,res) => {
  const userID = req.params.id;
  const queryString = "select * from user where id = ?";
  MysqlConnection.query(queryString, [userID], (err, rows, fields) =>{
    if (err){
        console.log(err);
        res.send(err);
    }

    else{
      res.send(rows);
    }
  })
})

/****
 delete user by id
 */

router.delete('/:id', (req,res) => {
  const userID = req.params.id;
  const queryString1 = "delete from user where id = ?";
  MysqlConnection.query(queryString1, [userID], (err, rows, fields) =>{
    if (err){
        console.log(err);
        res.send(err);
    }
  
      else{
        res.send("Deleted successfully");
      }
    })

})

/****
 insert a user 
 */

router.post('/', (req,res) => {
  let usr = req.body;
  var sql = "SET @id=?; SET @email=?;SET @password=?; SET @name=?;CALL UserAddOrEdit(@id,@email,@password,@name);";
  MysqlConnection.query(sql, [ usr.id,usr.email,usr.password,usr.name],(err, rows, fields) =>{
    if (!err){
      rows.forEach(element => {
        if(element.constructor == Array)
          res.send("User :" +usr.name+"created successfully");
      });
    }

    else{
        console.log(err);
        res.send(err);
    }
  })

});


/****
 update  user
 */

router.put('/', (req,res) => {
  let usr = req.body;
  var sql = "SET @id=?; SET @email=?;SET @password=?; SET @name=?;CALL UserAddOrEdit(@id,@email,@password,@name);";
  MysqlConnection.query(sql, [ usr.id,usr.email,usr.password,usr.name],(err, rows, fields) =>{
    if (!err){
          res.send("updated successfully");
      
    }

    else{
        console.log(err);
        res.send(err);
    }
  })
});
 module.exports = router;
