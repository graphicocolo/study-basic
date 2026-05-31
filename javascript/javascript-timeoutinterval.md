# JavaScript 一定時間後に実行

- [Window: setTimeout() メソッド](https://developer.mozilla.org/ja/docs/Web/API/Window/setTimeout)
  - > 時間切れになると、関数または指定されたコードの断片を実行するタイマーを設定
  - 単位はミリ秒（1000ミリ秒 = 1秒）
- [Window: setInterval() メソッド](https://developer.mozilla.org/ja/docs/Web/API/Window/setInterval)
  - > 一定の間隔を置いて関数やコードスニペットを繰り返し呼び出し
  - 単位はミリ秒（1000ミリ秒 = 1秒）
- [Window: clearTimeout() メソッド](https://developer.mozilla.org/ja/docs/Web/API/Window/clearTimeout)
  - > `Window.setTimeout()` の呼び出しによって以前に確立されたタイムアウトを解除
- [Window: clearInterval() メソッド](https://developer.mozilla.org/ja/docs/Web/API/Window/clearInterval)
  - > 以前に `setInterval()` の呼び出しによって確立された時限繰り返し動作を取り消し

## `setTimeout()` と `clearTimeout()`

`setTimeout()` の返り値は、タイマーを一意に識別する正の整数

この識別子を `clearTimeout()` に渡すことでタイマーを停止できる

```js
const timerId = setTimeout(() => {
  console.log("1秒経過");
}, 1000);
clearTimeout(timerId)；
```

## `setInterval()` と `clearInterval()`

`setInterval()` の返り値は、インターバルタイマーを一意に識別する正の整数

この識別子を `clearInterval()` に渡すことでインターバルタイマーを停止し、指定した関数の繰り返しを停止できる

```js
function showTime() {
  console.log(new Date());
}

const intervalTimerId = setInterval(console.log(showTime()), 1000);
clearInterval(intervalTimerId);
```

---

## タイマーのイメージ

| 関数 | イメージ |
|------|---------|
| `setTimeout` | 「3秒後に1回だけ鳴るアラーム」 |
| `clearTimeout` | 「そのアラームをキャンセル」 |
| `setInterval` | 「3秒ごとに繰り返し鳴るアラーム」 |
| `clearInterval` | 「その繰り返しアラームをキャンセル」 |

---

## 実務でよく使うパターン

### パターン1：ボタンを押したら送信、でも連打防止

```js
let isSending = false;

document.getElementById("btn").addEventListener("click", () => {
  if (isSending) return; // 送信中は無視

  isSending = true;
  console.log("送信中...");

  // 2秒後に送信完了（実際はAPIリクエストが終わったら）
  setTimeout(() => {
    console.log("送信完了！");
    isSending = false; // また押せるようにする
  }, 2000);
});
```

### パターン2：一定時間操作がなければ自動ログアウト

```js
let logoutTimer;

function resetTimer() {
  clearTimeout(logoutTimer); // 前のタイマーをリセット
  logoutTimer = setTimeout(() => {
    console.log("5分間操作がないのでログアウトします");
  }, 5 * 60 * 1000); // 5分
}

// マウスやキーが動くたびにタイマーをリセット
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);

resetTimer(); // 最初に起動
```

### パターン3：リアルタイム時計（ストップウォッチにも応用できる）

```js
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}

// 1秒ごとに時計を更新
const clockTimer = setInterval(updateClock, 1000);
updateClock(); // 最初の1秒を待たずに即表示

// ページを離れるときに止める（メモリリーク防止）
window.addEventListener("beforeunload", () => {
  clearInterval(clockTimer);
});
```

### パターン4：デバウンス（検索ボックスでよく使う）

```js
// 入力のたびにAPIを叩くと重いので、「入力が止まってから0.5秒後」に実行する
let searchTimer;

document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(searchTimer); // 入力のたびにリセット

  searchTimer = setTimeout(() => {
    console.log(`「${e.target.value}」で検索`); // 0.5秒止まったら実行
  }, 500);
});
```

---

## よくあるミスとその対策

### ミス1：`clearInterval` し忘れ → メモリリーク

```js
// NG: コンポーネントが消えてもタイマーが走り続ける
setInterval(() => {
  console.log("ずっと動いてる...");
}, 1000);

// OK: 必ず変数に入れて、不要になったら止める
const id = setInterval(() => { ... }, 1000);
// 後で
clearInterval(id);
```

### ミス2：`0` を指定しても「すぐ」ではない

```js
console.log("1番目");

setTimeout(() => {
  console.log("3番目"); // 0ms でも後回し
}, 0);

console.log("2番目");

// 出力: 1番目 → 2番目 → 3番目
```

> `setTimeout` は「今の処理が全部終わってから実行」という決まりがある（イベントループ）。

---

## `this` 問題

`this` は **「今、誰が呼び出しているか」** を指す特別な変数。

```js
const dog = {
  name: "ポチ",
  bark: function() {
    console.log(this.name + "が吠えた！"); // this = dog
  }
};

dog.bark(); // "ポチが吠えた！"
```

### 問題：`setTimeout` の中では `this` が変わってしまう

```js
const dog = {
  name: "ポチ",
  bark: function() {
    setTimeout(function() {
      console.log(this.name + "が吠えた！");
    }, 1000);
  }
};

dog.bark(); // "undefinedが吠えた！" になる
```

`setTimeout` に渡した `function` は **ブラウザ（window）が1秒後に呼び出す**。
呼び出しているのは `dog` ではなく **ブラウザ** なので `this = window` になってしまう。

### 解決策：アロー関数を使う

```js
const dog = {
  name: "ポチ",
  bark: function() {
    setTimeout(() => {                        // function → アロー関数に変更
      console.log(this.name + "が吠えた！"); // 外側のスコープが this = dog のまま！
    }, 1000);
  }
};

dog.bark(); // "ポチが吠えた！" ✅
```

`function` と `=>` (アロー関数) の `this` の決まり方の違い：

| | `this` の決まり方 |
|--|--|
| `function` | **呼び出した人**（実行時に決まる） |
| アロー関数 | **書かれた場所**（定義時に決まる） |

アロー関数は「書かれた場所の `this` をそのまま使う」ため、`bark` の中で書いた `=>` は `bark` の `this`（= `dog`）を引き継ぐ。

```
【function の場合】
dog.bark()  →  this = dog ✅
  setTimeout( function() { this = window ❌ } )  ← 呼び出し主がブラウザに変わる

【アロー関数の場合】
dog.bark()  →  this = dog ✅
  setTimeout( () => { this = dog ✅ } )  ← 書かれた場所の this を引き継ぐ
```

**実務では基本アロー関数を使えばOK：**

```js
// NG（function は this が変わることがある）
setTimeout(function() { ... }, 1000);

// OK（アロー関数は this が変わらない）
setTimeout(() => { ... }, 1000);
```

---

## まとめ

| やりたいこと | 使う関数 |
|-------------|---------|
| N秒後に1回だけ処理 | `setTimeout` |
| そのキャンセル | `clearTimeout` |
| N秒ごとに繰り返し処理 | `setInterval` |
| その繰り返しを止める | `clearInterval` |

**必ず覚えるルール：**
1. `setTimeout` / `setInterval` の返り値（ID）は変数に入れる
2. 不要になったら必ず `clear〜` でキャンセルする
3. `setInterval` は止め忘れると永遠に動く（メモリリーク）

