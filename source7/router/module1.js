module.export = (app, fs) => {

    // http://localhost:3000
    app.get('/', (req, res) => {
        res.render('index.ejs', {
            length: 10
        });
    });

    // http://localhost:3000/about
    app.get('/about', (req, res) => {
        res.render('about.html');
    });

    // http://localhost:3000/list
    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => { // 절대경로값  (.. = 한 단계 더 뒤로 나감)
            if(!err) {
                console.log(data);
                res.writeHead(200, {'content-type':'text/json:charset=utf-8'});
                res.end(data);
            } else {
                console.log(err);
            }
        })
    });

    // http://;pca;jpst:3000/joinpage
    app.get('/')

    // http://localhost:3000/getMember/apple
    app.get('/getMember/:userid', (req, res) => { // :(text) = 파라미터가 됨
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            if(!err){
                const member = JSON.parse(data);
                res.json(member[req.params.userid]);
            }else{
                console.log(err);
            }
        })
    });


    // http://localhost:3000/joinMember/apple
    app.post('/joinMember/:userid', (req, res) => {
        const result = {};
        const userid = req.params.userid;
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 100;
            result["lmsg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            const member = JSON.parse(data);
            if(member[userid]){
                result["success"] = 100;
                result["msg"] = "duplicate";
                res.json(result);
                return false;
            }
            console.log(req.body);
            member[userid] = req.body;
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(member, null, '\t'),
            'utf', (err, data) => {
                if(!err){
                    result["success"] = 200;
                    result["msg"] = "success";
                    res.json(result);
                } else {
                    console.log(err);
                }
            });
        });
    });

    // http://localhost:3000/updateMember/apple
    app.put('/updateMember/:userid', (req, res) => {
        const result = {};
        const userid = req.params.userid;
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 100;
            result["msg"] = "invalid request"; 
            res.json(result);
            return false;
        }
        fs.readFIle(__dirname + "/../data/member.json", "utf8", (err, data) => {
            if(!err){
                const member = JSON.parse(data);
                member[userid] = req.body;
                fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(member, null, '/t'), 'utf8', (err, data) => {
                    if(!err){
                        result["success"] = 200;
                        result["msg"] = "success";
                        res.json(result);
                    }else{
                        console.log(err);
                    }
                });
            }else{
                console.log(err);
            }
        });
    });

    // http://localhost:3000/deleteMember/berry
    app.delete('/deleteMember/:userid', (req, res) => {
        let result = {};
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            const member = JSON.parse(data);
            if(!member[req.params.userid]){
                result["succeses"] = 102;
                result["msg"] = "not found"; 
                res.json(result);
                return false;
            }
            delete member[req.params.userid];
            fs.writeFile(__dirname + "/../data/member.json", JSON.stringify(member, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            })
        });
    });
}