# JavaScript エラーハンドリング（try/catch）

## try/catch の基本形

try ブロック内でエラーが起きると、catch ブロックに処理が移る

エラーが起きなければ catch はスキップされる

```js
function divide(a, b) {
  try {
    if (b === 0) {
      throw new Error("0で割ることはできません");
    }
    console.log("結果:", a / b);
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
  }
}

divide(10, 2);  // 結果: 5
divide(10, 0);  // エラーが発生しました: 0で割ることはできません
```

---

## Error オブジェクトを観察する

catch で受け取る error には以下のプロパティがある

error.message : エラーの説明文

error.name    : エラーの種類（"Error", "TypeError" など）

```js
try {
  null.toString(); // null のプロパティにはアクセスできない → TypeError
} catch (error) {
  console.log("error.name    :", error.name);    // TypeError
  console.log("error.message :", error.message); // Cannot read properties of null...
}
```

---

## finally — 成功・失敗どちらでも実行される

finally は try/catch の後に必ず実行されるブロック

「通信中...」を消す、ローディング表示をOFFにする、などに使う

```js
function fetchWithFinally() {
  console.log("通信開始");
  try {
    throw new Error("サーバーエラー");
  } catch (error) {
    console.error("エラー:", error.message);
  } finally {
    console.log("通信終了（成功でも失敗でも実行される）");
  }
}

fetchWithFinally();
// 通信開始
// エラー: サーバーエラー
// 通信終了（成功でも失敗でも実行される）
```

---

## fetch 特有のエラーハンドリング

fetch で注意が必要な点：
  - ネットワークエラー（通信できない）→ catch で捕捉できる
  - HTTPエラー（404 / 500 など）     → catch では捕捉できない！
    → fetch は 404 でも Promise を reject しないため
    → response.ok または response.status で自分でチェックする必要がある

```js
async function fetchTodo(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

    // HTTPエラーを自分で検出する
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();
    console.log("取得成功:", data);
  } catch (error) {
    console.error("エラー:", error.message);
  }
}

fetchTodo(1);    // 取得成功: {userId: 1, id: 1, ...}
fetchTodo(9999); // HTTPエラー: 404（存在しないID）
```

---

Q: fetch で 404 が返ってきたとき、なぜ catch だけでは捕捉できないの？
A: 404 はネットワークエラーではなく、HTTP エラーだから。fetchはHTTPエラーでもPromiseをrejectしない仕様のため

Q: response.ok とは何？どんな値のとき true になる？
A: response.ok とは、API からレスポンスが返ってきた状態のこと
200〜299 のとき true となる。404 や 500 では false となる

Q: finally はどんな場面で使うと便利？
A: API データ取得後に必ず行いたい処理がある場合に使用すると便利（例えばローディング表示の終了など）

## 参照

- []()
