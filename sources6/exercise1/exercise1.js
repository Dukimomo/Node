const nodemailer = require('nodemailer');

const transportrer = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: "Ivythemaltese@gmail.com",
        pass: "Ivylove415"
    },
    host: 'smtp.gmail.com',
    port: '465'
});

const mailOptions = {
    from: "이름<Ivythemaltese@gmail.com>", //보낸이
    to: "이름<kdmpro1024@gmail.com>", // 받는사람
    subject: "node.js.의 nodemailer 테스트중입니다.",
    html: "<h2>안녕하세요. 메일이 잘 가나요?</h2><p style='color: deeppink'>정밀"
};

transportrer.sendMail(mailOptions, (err, info) => {
    transportrer.close();
    if(err){
        console.log(err);
    } else {
        console.log(info);
    }
});