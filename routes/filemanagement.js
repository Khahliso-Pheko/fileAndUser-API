const express = require('express');
const router = express.Router();
const fs  = require('fs');
const path = require('path');
const userFiles = './File_uploads/';
const MysqlConnection = require('../connection');
var fileArray = [];
var wordCountArray=[];
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

/****
 get word check files and score
 */

 router.get('/search/:word', (req,res) => {
   fileArray=[];
   wordCountArray=[];
  searchFilesInDirectory(userFiles, req.params.word, '.txt');
  //res.send({data: dataChunk, results: results[1]});
  //res.send(fileArray,wordCountArray);
  res.json({ fileArray, wordCountArray})
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
   

   function searchFilesInDirectory(dir, filter, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }

    const files = getFilesInDirectory(dir, ext);

    files.forEach(file => {
        const fileContent = fs.readFileSync(file);
        let base64ToString = Buffer.from(fileContent, "base64").toString();
        
       

        // We want full words, so we use full word boundary in regex.
        const regex = new RegExp('\\b' + filter + '\\b');
        if (regex.test(fileContent)) {
          var count  = countOccurences(base64ToString,filter);
          var trucatedFile = file.slice(13);
            fileArray.push(trucatedFile);
            wordCountArray.push(count);
        }
    });
}

// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
function getFilesInDirectory(dir, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
        if (stat.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath, ext);
            files = files.concat(nestedFiles);
        } else {
            if (path.extname(file) === ext) {
                files.push(filePath);
            }
        }
    });

    return files;
}

function countOccurences(string, word) {
  return string.split(word).length - 1;
}


router.use('/', express.static(userFiles));
 module.exports = router;
