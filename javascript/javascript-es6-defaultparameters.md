# JavaScript ES6（ES2015） デフォルト値（関数のデフォルト引数）

引数が渡されなかったときの「初期値」を設定できる

```js
// デフォルト値なし
function greet(name) {
  console.log("こんにちは、" + name + "さん！");
}
greet();        // こんにちは、undefinedさん！ 😱

// デフォルト値あり
function greet(name = "ゲスト") {
  console.log("こんにちは、" + name + "さん！");
}
greet();        // こんにちは、ゲストさん！ ✅
greet("田中");  // こんにちは、田中さん！   ✅（渡せば上書きされる）
```

---

## デフォルト値が使われる条件

引数が `undefined` のときだけデフォルト値が使われる

```js
function example(value = "デフォルト") {
  console.log(value);
}

example();          // "デフォルト"  ← 引数なし = undefined
example(undefined); // "デフォルト"  ← 明示的に undefined
example(null);      // null         ← null は undefined ではないので、デフォルト値は使われない
example("");        // ""           ← 空文字もそのまま使われる
example(0);         // 0            ← 0 もそのまま使われる
```

---

## 実務でよく使うパターン

### 1. オプション引数に初期値を設定する

```js
// APIからデータを取得する関数
function fetchUsers(page = 1, limit = 20) {
  console.log(`${page}ページ目を${limit}件取得`);
}

fetchUsers();       // 1ページ目を20件取得（両方デフォルト）
fetchUsers(3);      // 3ページ目を20件取得（limitだけデフォルト）
fetchUsers(2, 50);  // 2ページ目を50件取得（デフォルト値なし）
```

### 2. オブジェクトのデフォルト値（最も実務で多い）

```js
// 設定オブジェクトにデフォルト値を設定する
function createButton(text, options = {}) {
  const color = options.color || "blue";
  const size = options.size || "medium";
  console.log(`${text}ボタン: 色=${color}, サイズ=${size}`);
}

createButton("送信");                          // 送信ボタン: 色=blue, サイズ=medium
createButton("削除", { color: "red" });        // 削除ボタン: 色=red, サイズ=medium
createButton("検索", { color: "green", size: "large" }); // 検索ボタン: 色=green, サイズ=large
```

`options = {}` がないと、`createButton("送信")` で `options.color` にアクセスした瞬間に「`undefined` のプロパティは読めない」とエラーになる

```js
// 良くない書き方
function createButton(text, options = { color: "blue", size: "medium" }) {
  console.log(`${text}ボタン: 色=${color}, サイズ=${size}`);
}

// 引数なし → デフォルトオブジェクトがまるごと使われる
createButton("送信"); // 送信ボタン: 色=blue, サイズ=medium

// 両方指定 → 問題なし
createButton("削除", { color: "red", size: "large" }); // 削除ボタン: 色=red, サイズ=large

// ⚠️  一部だけ指定すると…
createButton("検索", { color: "green" }); // 検索ボタン: 色=green, サイズ=undefined
```

デフォルト引数は 引数が undefined のときに丸ごと置き換わる 仕組みです。

```text
引数なし       → options = { color: "blue", size: "medium" }（デフォルトが使われる）
{ color: "green" } を渡した → options = { color: "green" }（デフォルトは完全に無視される）
```

プロパティ単位でマージしてくれるわけではなく、オブジェクトごと「使うか使わないか」 の二択です。

だから実務では `options = {}` と書く

この書き方なら、プロパティごとに個別のデフォルト値を持てるので、一部だけ指定しても安全です。

### 3. ES2015以前は対応できなかった

```js
// ES2015以前 → 自分で undefined チェックを書いていた
function greet(name) {
  name = name !== undefined ? name : "ゲスト";
  // もしくは
  name = name || "ゲスト"; // ← 0 や "" も置き換わるバグの元
  console.log("こんにちは、" + name + "さん！");
}

// ES2015以降 → デフォルト引数で簡潔に書ける
function greet(name = "ゲスト") {
  console.log("こんにちは、" + name + "さん！");
}
```

### 4. アロー関数でも使える

```js
const tax = (price, rate = 0.1) => price * (1 + rate);

console.log(tax(1000));      // 1100（税率10%がデフォルト）
console.log(tax(1000, 0.08)); // 1080（税率8%を指定）
```

---

## まとめ

| ポイント | 内容 |
|---|---|
| 書き方 | `function fn(a = デフォルト値)` |
| 発動条件 | 引数が `undefined` のときだけデフォルト値が使われる |
| `null`, `0`, `""` | デフォルト値は使われない（そのまま渡る） |
| 実務で一番多い形 | `options = {}` でオブジェクト引数の安全な初期化 |
| ES2015以前との比較 | `a = a \|\| "初期値"` より安全で読みやすい |

## 参照

- [デフォルト引数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Default_parameters)
