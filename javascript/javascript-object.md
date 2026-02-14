# JavaScript オブジェクト

名前付きの値をまとめて入れる箱。値（プロパティ）と機能（メソッド）が集まった存在

## 基本：変数との違い

変数は「1つの値」しか入らない。オブジェクトは「複数の値をまとめて」持てる。

```js
// 変数だとバラバラ
const name = "田中太郎";
const age = 25;
const hobby = "サッカー";

// オブジェクトなら1つにまとめられる
const person = {
  name: "田中太郎",
  age: 25,
  hobby: "サッカー",
};
```

`name`、`age`、`hobby` を **プロパティ**（属性）と呼ぶ。

## 値の取り出し方（2通り）

```js
// ドット記法（普段はこっちを使う）
console.log(person.name);  // "田中太郎"

// ブラケット記法（変数でキーを指定したいときに使う）
console.log(person["name"]);  // "田中太郎"

const key = "age";
console.log(person[key]);  // 25
```

## オブジェクトの中に関数を入れる（メソッド）

```js
const person = {
  name: "田中太郎",
  greet() {
    console.log(`こんにちは、${this.name}です`);
  },
};

person.greet();  // "こんにちは、田中太郎です"
```

オブジェクトの中にある関数を **メソッド** と呼ぶ。`this` はそのオブジェクト自身を指す。

## 実務で最も使う場面：データの受け渡し

APIから返ってくるデータはほぼオブジェクト。

```js
// APIから返ってくるデータのイメージ
const user = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com",
  address: {
    city: "東京",
    zip: "100-0001",
  },
};

// ネスト（入れ子）されたオブジェクトもドットでたどれる
console.log(user.address.city);  // "東京"
```

## 分割代入（デストラクチャリング）

プロパティを一気に変数に取り出せる。

```js
const user = { name: "田中太郎", age: 25, email: "tanaka@example.com" };

// 普通に取り出す
const name = user.name;
const age = user.age;

// 分割代入なら1行で書ける
const { name, age, email } = user;
console.log(name);   // "田中太郎"
console.log(email);  // "tanaka@example.com"
```

## スプレッド構文

オブジェクトをコピー・結合するとき。

```js
const user = { name: "田中太郎", age: 25 };

// コピーして一部だけ変える
const updatedUser = { ...user, age: 26 };
console.log(updatedUser);  // { name: "田中太郎", age: 26 }
```

## まとめ

| 概念 | 一言で |
|---|---|
| **オブジェクト** | 名前付きの値をまとめた箱 |
| **プロパティ** | 箱の中の各データ（`name: "太郎"`） |
| **メソッド** | 箱の中に入った関数 |
| **分割代入** | プロパティを一気に変数に取り出す |
| **スプレッド構文** | オブジェクトをコピー・結合する |

実務では「APIのデータを受け取る → 分割代入で取り出す → 画面に表示する」という流れが日常的に出てくる。

