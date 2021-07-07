const express = require('express');
const bodyParser = require('body-parser');
// npm i mongodb
const MongoClient = require('mongodb').MongoClient;

const app = express();
const router = express.Router();

const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));

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
            
        }
    })
}

// 회원가입
// http://localhost:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(database){
        joinMember(database, userid, userpw, name, age, (err, result) => {
            if(!err){
                if(result.insertedCount > 0){
                    res.writeHead('200', {'content-type':'text/html;charset-utf8'});
                    res.write('<h2>회원가입 성공</h2>');
                    res.write('<p>가입이 성공적으로 완료되었습니다.</p>');
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>회원가입 실패</h2>');
                    res.write('<p>가입에 실패되었습니다.</p>');
                    res.end();      
                }
            }else{
                res.writeHead('200', {'content-type':'text/html;charset-utf8'});
                res.write('<h2>회원가입 실패</h2>');
                res.write('<p>어류가 발생했습니다..</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패')
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end(); // register create ==> collection => add req
    }
});

//로그인
router.route('/member/login').post((req, res) => {
    console.log('/member/login 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if(database){
        loginMember(database, userid, userpw, (err, result) => {
            if(!err){
                if(result){
                    console.log(result);
                    const resultUserid = result[0];userid;
                    const resultUserpw = result[0];userpw;
                    const resultName = result[0].username;
                    const resultAge = result[0].age;

                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>로그인 성공</h2>');
                    res.write(`<p>${resultUserid}(${resultName})님 환영합니다.</p>`);
                    res.write(`<p>나이 : ${resultAge}살</p>`);
                    res.end();
                }else {
                    res.writeHead('200', {'content-type':'text/html;charset'});
                    res.write('<h2>로그인 실패</h2>');
                    res.write('<p>아이디 또는 비밀번호를 확인하세요.</p>');
                    res.end();
                }
            }else{
                res.writeHead('200', {'content-type':'text/html;charset-utf8'});
                res.write('<h2>로그인 실패</h2>');
                res.write('<h2>서버 오류 발생! 로그인에 실패했습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

router.route('/member/edit').post((req, res) => {
    console.log('/member/edit 호출!');

    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(database){
        editMember(database, userid, userpw, name, age, (err, result) => {
            if(!err){
                if(result.modifiedCount > 0){
                    res.writeHead('200', {'content-type':'text/html;charset-utf8'});
                    res.write('<h2>회원정보 수정 성공</h2>');
                    res.write('<p>회원정보 수정에 성공했습니다.</p>');
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset-utf8'});
                    res.write('<h2>회원정보 수정 실패</h2>');
                    res.write('<p>정보 수정에 실패했습니다.</p>');
                    res.end();
                }
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 수정 실패</h2>');
                res.write('<p>서버 오류 발생! 정보 수정에 실패했습니다.</p>');
                res.end();
            }
            
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});



const joinMember = function(database, userid, userpw, name, age, callback){
    console.log('joinMember 호출!');
    const members = database.collection('member');
    members.insertMany([{userid:userid, userpw:userpw, username:name, age:age}], (err, result) => {
        if(!err){
            if(result.insertedCount > 0){
                console.log(`사용자 document ${result.insertedCount}명 추가 되었음!`);
            }else{
                console.log('사용자 document 추가되지 않음!');
            }
            callback(null, result);
            return;
        }else{
            console.log(err);
            callback(err, null); 
        }//내시는
    });
}

const loginMember = function(database, userid, userpw, callback){
    console.log('loginMember 호출!');
    const members = database.collection('member');

    members.find({userid:userid, userpw:userpw}).toArray((err, result) => {
        if(!err){
            if(result.length > 0){
                console.log('사용자를 찾았습니다.');
                callback(null, result);
            }else{
                console.log('일치하는 사용자가 없습니다.');
                callback(null, null);
            }
            return;
        }else{
            console.log(err);
            callback(err, null);
        }
    });
}

app.use("/", router);

app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중...`);
    connectDB();
});