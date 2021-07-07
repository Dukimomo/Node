const express = require('express');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const app = express();
const router = express.Router();
 
app.user(bodyParser.urlencoded({extended: false}));

let database;

// mongodb 연결 함수
function connectDB(){
    const databaseURL = "mongodb://localhost:27017";
    MongoClient.connect(databaseURL, (err, db) => {
        if(!err){
            const tempdb = db.db('frontenddb');
            database = tempdb;
            console.log('mongodb 데이터베이스 연결 성공!');
        }else{
            console.log(err);
        }
    }); 
} 