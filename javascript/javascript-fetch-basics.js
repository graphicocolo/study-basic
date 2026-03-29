// ============================================================
// fetch を使った外部API呼び出し
// 練習用API: https://jsonplaceholder.typicode.com
// ============================================================

// ============================================================
// STEP 1: fetch の基本形（Promise の .then() チェーン）
// ============================================================

// fetch() は Promise を返す
// .then() を2回つなぐのがポイント：
//   1回目: Response オブジェクト → .json() でパース（これも Promise を返す）
//   2回目: パースされたデータを受け取る

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => {
    console.log("ステータスコード:", response.status); // 200 なら成功
    console.log("Response オブジェクト:", response);   // 中身を観察してみよう
    return response.json(); // JSON に変換（Promise を返す）
  })
  .then((data) => {
    console.log("取得したデータ:", data);
  });

// 出力結果
// ステータスコード: 200
// Response オブジェクト: Response {type: 'cors', url: 'https://jsonplaceholder.typicode.com/todos/1', redirected: false, status: 200, ok: true, …}
// type: 'cors' に注目。外部ドメインへのリクエストなので CORS通信になっています。
// ok: true は status が 200〜299 のときに true になるプロパティ。
// 取得したデータ: {userId: 1, id: 1, title: 'delectus aut autem', completed: false}

// ============================================================
// STEP 2: async/await で書き直す（同じ処理）
// ============================================================

// TODO: 上の fetch を async/await で書き直してみよう
// ヒント: async function fetchTodo() { ... } の形で書く

// ここに書いてみよう↓
async function fetchTodo () {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error("データ取得エラー：", error.message)
  }
}
fetchTodo()
// 出力結果
// Promise {<pending>}
// [[Prototype]]:Promise
// ...
// {userId: 1, id: 1, title: 'delectus aut autem', completed: false}


// ============================================================
// STEP 3: レスポンスの中身を確認する
// ============================================================

// jsonplaceholder.typicode.com/todos/1 のレスポンスはこんな形：
// {
//   userId: 1,
//   id: 1,
//   title: "delectus aut autem",
//   completed: false
// }

// TODO: data.title だけを取り出して console.log してみよう
async function fetchTodoOnlyTitle () {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    const data = await response.json()
    console.log(data.title)
  } catch (error) {
    console.error("データ取得エラー：", error.message)
  }
}
fetchTodoOnlyTitle()
// 出力結果
// delectus aut autem

// ============================================================
// 振り返りメモ（自分の言葉で書いてみよう）
// ============================================================

// Q: fetch はどこで Promise を返している？
// A: Promise を使った場合は、.then((response) => {ここで Promise を返す}
// async/await を使った場合は、const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")でresponseに代入されている
// ↓回答
// fetch() を呼び出した瞬間に Promise を返している。.then() でも async/await でも変わらない。
// .then() → fetch() の Promise を .then() で受け取る
// async/await → fetch() の Promise を await で「待って」から response に代入する
// await は「Promise の完了を待って、結果を取り出す」構文。Promise を返すのは fetch() 自体。

// Q: なぜ .then() が2回必要なの？
// A: 1回目のthenでは Promise オブジェクトが返るので、2回目の.then() でオブジェクト形式のデータを取得するため
// ↓回答
// response.json() も Promise を返すため。
// 1回目の .then() で response.json() を return すると、その Promise を2回目の .then() が受け取る。
// async/await だと await を2回書けばいいだけなので、この構造が見えやすい。
