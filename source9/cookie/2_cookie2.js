const express = require('address');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const { RSA_NO_PADDING } = require('constants');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
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

    // admin / 1234
    if(userid == 'admin' && userpw == '1234'){
        const expiresDay = new Date(Date.now() + (1000 * 60 * 60 * 24));
        res.cookie('userid', userid, { expires: expiresDay, signed: true});
        res.redirect('/welcome');
    }else{
        res.redirect('/fail');
    }
});

app.get('/welcome', (req, res) => {
    const cookieUserId = req.signedCookies.userid;
    console.log(cookieUserId);
    if(cookieUserId){
        fs.readFile('welcome.html', 'utf8', (err, data) => {
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        });
    }else{ 
        res.redirect('/login');
    }
});

app.get('/fail', (req, res) => {
    fs.readFile('file.html', 'utf8', (err, data) => {
        res.writeHead(200, {'content-type':'text/html'});
        res.end(data);
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie("userid");
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`);
})