# JavaScript ES6（ES2015） 分割代入

オブジェクトや配列から、中身を取り出して個別の変数に入れる書き方

- オブジェクトの分割代入 - 基本、別名、デフォルト値との組み合わせ
- 配列の分割代入 - 基本、スキップ、変数の入れ替え
- 実務でよく使うパターン5つ - 関数引数での分割代入（最頻出）、デフォルト値との二段構え、戻り値からの取り出し、import文、ネスト
- まとめ表と参照リンク

## オブジェクトの分割代入

### 基本

```js
// 従来の書き方
const user = { name: "田中", age: 25 };
const name = user.name;
const age = user.age;

// 分割代入 → 一行で済む
const user = { name: "田中", age: 25 };
const { name, age } = user;

console.log(name); // "田中"
console.log(age);  // 25
```

ポイント：`{}` の中の変数名は、オブジェクトの**プロパティ名と一致させる**必要がある

### 別名をつける

プロパティ名とは違う変数名を使いたいとき

```js
const user = { name: "田中", age: 25 };
const { name: userName, age: userAge } = user;

console.log(userName); // "田中"
console.log(userAge);  // 25
console.log(name);     // ❌ エラー（name という変数は作られていない）
```

### デフォルト値と組み合わせる

```js
const user = { name: "田中" };
const { name, age = 20 } = user;

console.log(name); // "田中"
console.log(age);  // 20（user に age がないのでデフォルト値が使われる）
```

---

## 配列の分割代入

### 基本

```js
const colors = ["赤", "青", "緑"];

// 従来の書き方
const first = colors[0];
const second = colors[1];

// 分割代入
const [first, second, third] = colors;

console.log(first);  // "赤"
console.log(second); // "青"
console.log(third);  // "緑"
```

ポイント：配列は**順番**で対応する（オブジェクトは名前で対応する）

### 一部だけ取り出す

```js
const colors = ["赤", "青", "緑"];

// 2番目だけスキップ
const [first, , third] = colors;
console.log(first); // "赤"
console.log(third); // "緑"
```

### 変数の入れ替え

```js
let a = 1;
let b = 2;

// 従来は一時変数が必要だった
// const temp = a; a = b; b = temp;

// 分割代入なら一行
[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

---

## 実務でよく使うパターン

### 1. 関数の引数で分割代入（最も多い）

```js
// 従来：options.color, options.size と毎回書く
function createButton(options) {
  console.log(`色=${options.color}, サイズ=${options.size}`);
}

// 分割代入：引数の時点で取り出す
function createButton({ color, size }) {
  console.log(`色=${color}, サイズ=${size}`);
}

createButton({ color: "red", size: "large" });
// 色=red, サイズ=large
```

### 2. デフォルト値と組み合わせた引数（実務で非常に多い）

```js
function createButton({ color = "blue", size = "medium" } = {}) {
  console.log(`色=${color}, サイズ=${size}`);
}

createButton();                    // 色=blue, サイズ=medium（全部デフォルト）
createButton({ color: "red" });    // 色=red, サイズ=medium（一部だけ指定）
```

`= {}` は引数自体が渡されなかったとき用、`color = "blue"` はプロパティがなかったとき用。二段構えで安全にしている

### 3. 関数の戻り値から必要なものだけ取り出す

```js
function getUser() {
  return { name: "田中", age: 25, email: "tanaka@example.com" };
}

// 必要なものだけ受け取る
const { name, email } = getUser();
console.log(name);  // "田中"
console.log(email); // "tanaka@example.com"
```

### 4. import 文での分割代入

```js
// React でよく見る書き方。これも分割代入の仲間
import { useState, useEffect } from "react";
```

### 5. ネスト（入れ子）されたオブジェクト

```js
const user = {
  name: "田中",
  address: {
    city: "東京",
    zip: "100-0001",
  },
};

const { name, address: { city } } = user;
console.log(name); // "田中"
console.log(city); // "東京"
```

---

## まとめ

| ポイント | 内容 |
|---|---|
| オブジェクトの分割代入 | `const { name, age } = obj` プロパティ名で対応 |
| 配列の分割代入 | `const [a, b] = arr` 順番で対応 |
| 別名 | `const { name: userName } = obj` |
| デフォルト値 | `const { age = 20 } = obj` |
| 引数で使う（実務で最多） | `function fn({ color, size } = {})` |
| ネスト | `const { address: { city } } = obj` |

## 参照

- [分割代入](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
