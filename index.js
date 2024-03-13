let port = 3000;    //ポート番号
let express = require("express");
let app = express();
app.set("view engine", "ejs");  //テンプレートエンジンの指定
let sqlite3 = require("sqlite3");   //sqlite3
let db = new sqlite3.Database("db/sample_data.db");
let bb_dat = {dat:null};    //ejs転送用オブジェクト
//テーブルより全データを取得
db.all("select * from bbteams where team",
    function(err,rows) {
    bb_dat.dat = rows;
});
//ルートにアクセス時index.ejsにbb_datを渡し、応答する
app.get("/",function(req,res){
    res.render("index.ejs",bb_dat); 
});
//POST受信は次の行が必要
app.use(express.urlencoded({ extended: true }));
//POSTされたとき
app.post("/", function(req,res){
    console.log("post:" + req.body.word);   //req.body.inputタグのname　で編集取得
    let keyword = "%" + req.body.word + "%";
    new Promise(function(resolve,reject){    //Promiseで処理待ちさせています
        db.all("select * from bbteams where team like ? ", keyword,
            function(err,rows) {
                if(err){    //エラー時
                    reject(err)
                }else{      //エラーなし
                    resolve(rows);
                }
        });
    }).then(function(e){    //resolev()より呼出し
        bb_dat.dat = e;
        res.render("index.ejs",bb_dat); 
    }).catch(function(e){   //reject()より呼出し
        bb_dat.dat = e;
        console.log(e);
    });
});
//ポート番号を指定してWebサーバーとして起動
let listener = app.listen(port,function(){
    console.log("ブラウザにてlocalhost:" + port + "にアクセスしてください");
});
