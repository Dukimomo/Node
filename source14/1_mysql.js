const express = require('express');
const bodyparser = require('body-parser');
// npm i mysql
const mysql = require('mysql');
const logger = require('morgan');

const app = express();
const port = 3000;
const router = express.Router();

app.use(bodyparser.urlencoded({extended:false}));
app.use(logger('dev'));

const pool = mysql.createPool({ // html 만들어서 회원가입 되게 하면됨 router 걸어줄 이유가 없음 => 이미 html 파일이 구동중이라 ...
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'toor', // 진도
    database: 'nodejs',
    debug: false
});

// http://localhost:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    const userid = req.body.userid;
    const pass = req.body.pass;
    const name = req.body.name; //sh1
    const age = req.body.age;

    console.log(`userid:${userid}, pass:${pass}, name:${name}, age:${age}`);

    if(pool){
        joinMember(userid, pass, name, age, (err, result) => {
            if(!err){
                if(result){
                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>회원가입 성공</h2>');
                    res.end(); 
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset=uft8'});
                    res.write('<h2>회원가입 실패<h2>');
                    res.end();
                }
            }else{
                 console.log(err);
            }
        });
    }else{
        res.writeHead('200', {})
    }
});

router.route('/member/login').post((req, res) => {
    const userid = req.body.userid;
    const pass = req.body.pass;

    console.log(`userid:${userid}, pass:${pass}`);

    if(pool){
        loginMember(userid, pass, (err, result) => {
            if(!err){
                if(result){
                    console.dir(result);
                    const name = result[0].sm_name;
                    const age = result[0].sm_age;

                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>로그인 성공</h2>');
                    res.write(`<p>아이디 : ${userid}</p>`);
                    res.write(`<p>이름 : ${name}</p>`);
                    res.write(`<p>나이 : ${age}</p>`);
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>로그인 실패</h2>');
                    res.end();
                }
            }else{
                console.log(err);
            }
        })
    }else{
        res.writeHead('200', {'content-type':'text.html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});

const loginMember = function(userid, pass, callback){
    console.log('loginMember 호출!');

    pool.getConnection((err, conn) => {
        if(!err){
            //select sm_idx, sm_name, sm_age from tb_simplemember where 
            //sm_userid=? and sm_pass=sha1(?)
            const sql = conn.query('select sm_idx, sm_name, sm_age from tb_simplemember where sm_userid=? and sm_pass=sha1(?)', [userid, pass], (err, result) => {
                conn.release();
                console.log('sql 실행 완료!');
                if(!err){
                    if(result.length > 0){
                        console.log('일치하는 사용자를 찾음');
                        callback(null, result);
                    }else{
                        console.log('일치하는 사용자가 없음');
                        callback(null, null);
                    }
                    return;
                }else{
                    callback(err, null);
                }
                return;
            });
        }else{
            console.log(err);
        }
    })
}

const joinMember = function(userid, pass, name, age, callback){
    console.log('joinMember 호출!');

    pool.getConnection((err, conn) => {
        if(!err){
            console.log('데이터베이스 연결 성공');
            //insert into tb-simplemember (sm_userid, sm_pass, sm_name, sm_age)
            // values (?, sha1(?), ?, ?)
            const sql = conn.query('insert into tb_simplemember (sm_userid, sm_pass, sm_name, sm_age) values (?, sha1(?), ?, ?)', [userid, pass, name, age], (err, result) => {
                conn.release(); // 쿼리문을 실행하는 트릭!
                console.log('sql 실행 완료!');
                if(!err){
                    console.log('가입완료');
                    callback(null, result);
                    return;
                }else{
                    callback(err, null);
                }
            })
        }else{
            console.log(err); // 경우의 수가 3가지가 나옴
        }
    });
}



app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})