const express = require('express');
const router = express.Router();
const fs  = require('fs');
const path = require('path');
const userFiles = './File_uploads/';
const MysqlConnection = require('../connection');

router.get('/',(req,res)=>{
  MysqlConnection.query('select * from file',(err,rows,fields)=>{
     if(!err)
       res.send(rows);
     else  {
     console.log(err);
     res.send(err);
     }
  })
 });
 

/****
 get file by name
 */

router.get('/:name', (req,res) => {
  const userID = req.params.name;
  const queryString = "select * from file where name = ?";
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

router.put('/', (req, res) => {
    router.use(express.static(userFiles))
    const file = req.body;
    const base64data = file.content.replace(/^data:.*,/, '');
    fs.writeFile(userFiles + file.name, base64data, 'base64', (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        var datemodified=new Date(req.body.uploadDate);
        let formatted_date = datemodified.getFullYear() + "-" + (datemodified.getMonth() + 1) + "-" + datemodified.getDate()
        var sql = "insert into file values (?,?,?,?)";
        MysqlConnection.query(sql,[req.body.name,req.body.filesize,formatted_date ,req.body.content],(err, rows, fields) =>{
          if (!err){

          }
      
          else{
            console.log(err);
          }
        })

        res.set('Location', userFiles + file.name);
        res.status(200);
        res.send(file);
      }
    });
   });


   router.delete('/:name', (req, res) => {
    router.use(express.static(userFiles));
    const fileName = req.params.name;
    fs.unlink(userFiles + fileName, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        const queryString = "delete from file where name = ?";
        MysqlConnection.query(queryString, [fileName], (err, rows, fields) =>{
          if (err){
              console.log(err);
              res.send(err);
          }
        
            else{
              res.send("Deleted successfully");
            }
          })
      }
    });
   });
   
router.use('/', express.static(userFiles));
 module.exports = router;
