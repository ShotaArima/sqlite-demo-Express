let port = 3000;
let express = require("express");
let app = express();
app.set("view engine", "ejs");
let sqlite3 = require("sqlite3");
let db = new sqlite3.Database("db/sample_data.db");
let pl = "%ズ";

// アクセス時にデータベースからデータを取得してからレンダリングする
app.get("/", async function (req, res) {
  try {
    const bb_dat = await fetchData();
    res.render("index.ejs", { dat: bb_dat });
    console.log(bb_dat);
  } catch (error) {
    console.error("データの取得エラー:", error);
    res.status(500).send("サーバーエラー");
  }
});

// ポート番号を指定してWebサーバーとして起動
let listener = app.listen(port, function () {
  console.log("ブラウザにてlocalhost:" + port + "にアクセスしてください");
});

// データベースからデータを取得する関数を非同期で呼び出す
function fetchData() {
  return new Promise((resolve, reject) => {
    db.all("select * from bbteams where team like ?", pl, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
