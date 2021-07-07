const express = require('express');
const bodyParser = require('body-parser');
// npm i serve-static
const static = require('serve-static');
const path = require('path');
// npm i morgan
const logger = require('morgan');
// npm i multer
const multer = require('multer');

const port = 3000;

const app = express();
const router = express.Router(); // public/write.html

app.use(bodyParser.urlencoded({extended: false})); // 앞에: 가상, 뒤에: 물리적인 폴더명
app.use('/www', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads'))); // 정적인 파일로 인지를 성공!
app.use(logger('dev')); // dev, short, common, combined

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads'); // 자기가 자기를 호출!
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        callback(null, basename + "_" + Date.now() + extension);
        // apple.png
        // apple_32904820394.png
    }
});

const upload = multer({
    storage: storage,
    limit: {
        files: 5,
        fileSize: 1024 * 1024 * 100
    }
});

router.route('/write').post(upload.array('photo', 1), (req, res) => {
    console.log('/write 호출!'); // public 밑에 write 와 write html 생성하기
    try {
        const title = req.body.title;
        const content = req.body.content;
        const files = req.files;
        console.dir(req.files[0]);
        const originalname = files[0].originalname;
        const filename = files[0].filename;
        const mimetype = files[0].mimetype;
        const size = files[0].size;

        console.log(`파일정보 : 원본파일명:${originalname}, 파일이름:${filename}, mimetype:${mimetype}, size:${size}`);

        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>파일 업로드 성공</h2>');
        res.write('<hr>');
        res.write(`<p>제목 : ${title}</p>`);  
        res.write(`<p>내용 : ${content}</p>`);
        res.write(`<p>제목 : ${originalname}</p>`);
        res.write(`<p>제목 : ${filename}</p>`);
        res.write(`<p>제목 : ${mimetype}</p>`);
        res.write(`<p>제목 : ${size}</p>`);
        res.write(`<p><img src='/uploads/${filename}' width='200'></p>`);
        res.end();
    }catch(e){
        console.log(e);
    }
});

app.use("/", router);