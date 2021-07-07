const express = require('address');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser(' !@#$%^&*()'));

app.get('/login', (req, res) => {
    fs.readFile('login.html', 'utf8', (err, data) => {
        if(!err){
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }else{
            console.log(err);
        } 
    });
});

app.post('/loginOk', (req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    console.log(userid);
    console.log(userpw);
})