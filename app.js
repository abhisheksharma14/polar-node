const express = require("express");
const path = require("path");
const app = express();
const fileUpload = require('express-fileupload');
const cors = require("cors");
const fs = require("fs");

app.use(function(req, res, next) {
    console.log(`${req.method} => request for '${req.url}'`);
    next();
});

app.use(express.static("./public"));
app.use(fileUpload());

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/search',function(req,res){
  res.sendFile(path.join(__dirname+'/public/search.html'));
});

app.get('/search/hue/:lowerLimit/:upperLimit',function(req,res){
  fs.readFile("./data.js", function(err, data){
    data = JSON.parse(data);
    if (err) {
        res.send({
            response : 0,
            result : err
        });
    }else{
        res.send({
            response:1,
            result:data.slice(req.params.lowerLimit, req.params.upperLimit)
        });
    }
  });
  console.log(req.params.lowerLimit, req.params.upperLimit);
  // res.sendFile(path.join(__dirname+'/public/search.html'));
});


app.get('/upload',function(req,res){
  res.sendFile(path.join(__dirname+'/public/upload.html'));
});


app.get('/upload',function(req,res){
  res.sendFile(path.join(__dirname+'/public/upload.html'));
});

app.post('/uploadImage', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.use(cors());
app.listen(3000);
console.log("Express app running on port 3000");
module.exports = app;