const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: false}));

const module1 = require('./router/module1')(app, fs);
app.listen( port, () => {
    console.log( `${port}빈 포트로 서버 실행중...`);
})