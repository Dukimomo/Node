const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const port = 3000;
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));

router.route('/mail').get((req, res => {
    fs.readFile('mail.html', 'utf8', (err, data) => {
        if(!err){
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }else{
            console.log(err);
        }
    })
}));

router.route('./mailok').post((req, res) => {
    const from = req.body.from;
    const fromemail = req.body.fromemail;
    const to = req.body.to;
    const toemail = req.body.toemail;
    const title = req.body.title;
    const content = req.body.content;

    const fmtfrom = `${from}<${fromemail}>`;
    const fmtto = `${to}<${toemail}>`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'Ivythemaltese@gmail.com',
            pass: 'Ivylove415'
        },
        host: 'smtp.gmail.com',
        port: '465'
    });

    const mailOption = {
        from: fmtfrom,
        to: fmtto,
        subject: title,
        text: content
    };

    transporter.sendMail(mailOption, (err, info) => {
        transporter.close();
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
    });
});

app.use('/', router);
app.all('*', (req, res) => {
    res.status(404).send('<h2>페이지를 찾을 수 없습니다.</h2>')
})

app.listen( port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
});
