# JavaScript 日付と時刻

## 基本

```js
// date で日付と時刻が扱える
const date = Date.now();
console.log(date.toLocaleString());
```

- `.get〜()` メソッドで日時の値を取得
- `.set〜()` メソッドで日時の値を変更
- `.to〜()` メソッドで日時をまとめて取得

[Date](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date)

## オブジェクト

オブジェクトには、雛形のオブジェクトと実体のオブジェクトが存在する

```js
// 雛形の Date を、 new を用いて実体のオブジェクト date を作成
const date = +new Date();
```

## Dateオブジェクトの生成パターン

```js
new Date()                        // 現在日時
new Date('2024-01-15')            // 文字列から生成（ISO 8601形式が安全）
new Date('2024-01-15T10:30:00')   // 日時を文字列で指定
new Date(2024, 0, 15)             // 年・月・日で指定（月は0始まり！）
new Date(1705276800000)           // UNIXタイムスタンプ（ミリ秒）から生成
```

> **注意**: 月は 0〜11 の値を取る（1月 = 0、12月 = 11）

## よく使うgetterメソッド

```js
const d = new Date('2024-06-15T10:30:45');

d.getFullYear()   // 2024（年）
d.getMonth()      // 5（月 ※0始まり。6月なら5）
d.getDate()       // 15（日）
d.getDay()        // 6（曜日 ※0=日曜〜6=土曜）
d.getHours()      // 10（時）
d.getMinutes()    // 30（分）
d.getSeconds()    // 45（秒）
d.getTime()       // ミリ秒単位のUNIXタイムスタンプ
```

## タイムスタンプを使った日時の比較・差分計算

```js
const d1 = new Date('2024-01-01');
const d2 = new Date('2024-06-15');

// 比較（タイムスタンプ同士は数値なので > < で比較できる）
d2 > d1  // true

// 差分（ミリ秒）→ 日数に変換
const diffMs = d2 - d1;
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));  // 166日
```

## 現在のタイムスタンプを取得する

```js
Date.now()          // 現在時刻のタイムスタンプ（ミリ秒）。new Date() より軽量
+new Date()         // 同上（Dateオブジェクトを数値に変換）
```

**なぜ複数あるのか**

`Date.now()` が存在しなかった時代（ES5以前）に `+new Date()` が使われていた経緯があり、古いコードで今も見かけることがある。

- `Date.now()` — `Date` オブジェクトを生成せず直接タイムスタンプを返す静的メソッド。読みやすく処理が軽い
- `+new Date()` — `new Date()` でオブジェクトを作り、`+`（単項演算子）で数値に変換している。オブジェクト生成が無駄に発生するので非効率

**使い分け**

| 場面 | 使うべきもの |
|------|------------|
| 現代のコードを書く | `Date.now()` 一択 |
| 古いコードを読む | `+new Date()` を見たら「タイムスタンプ取得だな」と読める |

## toLocaleStringのオプション

```js
const d = new Date();

// ロケールとオプションで書式を制御できる
d.toLocaleString('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
// → "2024/06/15 10:30"

d.toLocaleDateString('ja-JP')  // "2024/6/15"
d.toLocaleTimeString('ja-JP')  // "10:30:45"
```

## イディオム集

### ゼロ埋め（01, 09 などの2桁表示）

```js
const month = String(d.getMonth() + 1).padStart(2, '0');  // "06"
const day   = String(d.getDate()).padStart(2, '0');        // "15"
```

### YYYY-MM-DD 形式の文字列を作る

```js
const d = new Date();
const yyyymmdd = d.toISOString().slice(0, 10);
// → "2024-06-15"（UTCベースなので日本時間とずれる場合あり）

// 日本時間で確実に取得したい場合
const yyyy = d.getFullYear();
const mm   = String(d.getMonth() + 1).padStart(2, '0');
const dd   = String(d.getDate()).padStart(2, '0');
const dateStr = `${yyyy}-${mm}-${dd}`;  // "2024-06-15"
```

### N日後・N日前の日付を求める

```js
const d = new Date();
d.setDate(d.getDate() + 7);   // 7日後（setDate は月をまたいでも自動調整）
d.setDate(d.getDate() - 3);   // 3日前
```

### 月の末日を求める

```js
// 翌月の0日目 = 今月の末日
const lastDay = new Date(2024, 2, 0).getDate();  // 29（2024年2月の末日）
```

### 経過時間の計測（処理時間など）

```js
const start = Date.now();
// ...何らかの処理...
const elapsed = Date.now() - start;  // ミリ秒
console.log(`${elapsed}ms`);
```

### 曜日名を取得する

```js
const days = ['日', '月', '火', '水', '木', '金', '土'];
const dayName = days[new Date().getDay()];  // "土"
```