const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
// npm i mongoose
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({extented:false}));
app.use(logger('dev'));

// 데이터 베이스 연결
let database;
let UserSchema;
let UserModel; 

function connectDB(){
    const url = "mongodb://localhost:27017/frontenddb";
    console.log('데이터베이스 연결 시도중 ... ');

    mongoose.Promise = global.Promise; // 몽구스의 프로미스 객체를 global의 프로미스 객체로 사용
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    database = mongoose.connection;
    database.on('error', console.error.bind(console, "mongoose 연결 실패!"));
    database.on('open', () => {
        console.log('데이터베이스 연결 성공!');
        UserSchema = mongoose.Schema({
            userid: String,
            userpw: String,
            name: String,
            gender: String
        });
        console.log('UserSchema 생성 완료!');

        UserSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });

        UserModel = mongoose.model('user', UserSchema);
        console.log('UserModel이 정의되었습니다.');
    });

}

// localhost: 3000/user/regist (post)
router.route('/user/regist').post((req, res) => {
    console.log('/user/regist 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const gender = req.body.gender;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, gender:${gender}`);

    if(database){
        joinUser(database, userid, userpw, name, gender, (err, result) => {
            if(!err){
                if(result){
                    res.writeHead('200', {'content-type':'text/html;charset-utf8'});
                    res.write('<h2>회원가입 성공</h2>');
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>회원가입 실패</h2>');
                    res.end();
                }
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>서버에러! 회원가입 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패')
        res.end();
    }
});

router.route('/user/login').post((req, res) => {
    console.log('/user/login 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if(database){
        loginUser(database, userid, userpw, (err, result) => {
            if(!err){
                if(result){
                    console.dir(result);
                    const name = result[0].name;
                    const gender = result[0].gender;
                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>로그인 성공</p>')
                    res.write(`<p>아이디 : ${userid}</p>`)
                    res.write(`<p>이름 : ${name}</p>`)
                    res.write(`<p>성별 : ${gender}</p>`)
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>로그인 실패</h2>');
                    res.end();
                }
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>서버오류! 로그인 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});

router.route('/user/list').get((req, res) => {
    if(database){
        UserModel.findAll((err, result) => {
            if(!err){
                if(result){
                    res.writeHead('200', {'content-type':'text/html;charset=uft8'});
                    res.write('<h2>회원 리스트</h2>');
                    res.write('<div><ul>');

                    for(let i=0; i<result.length; i++){
                        const userid = result[i].userid;
                        const name = result[i].name;
                        const gender = result[i].gender;

                        res.write(`<li>${i} : ${userid} / ${name} / ${gender}</li>`);
                    }
                    res.write('</ul></div>');
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset=uft8'});
                    res.write('<h2>회원 정보가 없습니다.</h2>');
                    res.write('<div><ul>');
                }
            }else{
                console.log('리스트 조회 실패');
            }
        })
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});

const joinUser = function(database, userid, userpw, name, gender, callback){
    console.log('joinUser 호출!');
    const users = new UserModel({userid:userid, userpw:userpw, name:name, gender:gender});

    users.save((err, result) => {
        if(!err){
            console.log('회원 document 가 추가되었습니다.');
            callback(null, result);
            return;
        }
        callback(err, null);
    });
}

const loginUser = function(database, userid, userpw, callback){
    console.log('loginUser 호출!');

    UserModel.find({userid:userid, userpw:userpw}, (err, result) => {
        if(!err){
            if(result.length > 0){
                console.log('일치하는 사용자를 찾음');
                callback(null, result);
            }else{
                console.log('일치하는 사용자가 없음');
                callback(null, null);
            }
            return;
        }
        callback(err, null);
    });
} 

app.use('/', router); 

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
    connectDB();
})