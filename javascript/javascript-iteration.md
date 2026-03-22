# 繰り返し処理 / filter / sort

## 頻出

| 優先度 | 記法 | 諦める時の理由 |
| ---- | ---- | ---- |
| 1 | map/filter/find | 効率のため、一つのループの中で複数の意味付けの処理を行いたかったり、意味合いがまとめられない場合は次を検討する |
| 2 | for...of | インデクスが必要だったり、処理を関数スコープで閉じたい理由があれば次を検討する |
| 3 | forEach | 配列の要素を繰り返すのではない場合には次を検討する |
| 4 | for |  |

---

## 非破壊的

### `map()`

全要素を変換した新しい配列を返す

[Array.prototype.map()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```js
// map()
// 配列の全ての要素に対して処理を行い
// 処理済みの新しい配列を返す
const numbers = [1, 2, 3, 4, 5];
const doubledNumbers = numbers.map((number) => {
  return number * 2;
});
// 結果の出力
console.log(doubledNumbers); // [2, 4, 6, 8, 10]
console.log(numbers); // numbers の各値はそのまま
```

### `filter()`

条件に一致した要素だけの新しい配列を返す

[Array.prototype.filter()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

```js
const numbers = [1, 2, 3, 4, 5];

// filter()
// コールバック関数が true を返した値で新しい配列を作成
const evenNumbers = numbers.filter((number) => {
  return number % 2 === 0;
});
// 結果の出力
console.log(evenNumbers); // [2, 4]
console.log(numbers); // numbers の各値はそのまま
```

### `find()`

[Array.prototype.find()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

> 提供されたテスト関数を満たす配列内の最初の要素を返します。 

```js
const array = [5, 12, 8, 130, 44];

const found = array.find((element) => element > 10);
console.log(found); // 予想される結果: 12
```

---

## `for...of`

[for...of](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...of)

---

## 課題1: `for...of` で合計を出す

```js
const scores = [85, 42, 91, 67, 55, 78];
// 60点以上のスコアだけを合計して出力してください
```

```js
// 自分の回答
const scores = [85, 42, 91, 67, 55, 78];
let total = 0

for (const score of scores) {
  // if (score >= 60) total = total + score
  if (score >= 60) total += score // こう書くほうがスマート
}
console.log(total) // 321
```

<details>
<summary>解答例</summary>

```js
const scores = [85, 42, 91, 67, 55, 78];
let total = 0;
for (const score of scores) {
  if (score >= 60) {
    total += score;
  }
}
console.log(total); // 321
```

</details>

---

## 課題2: `filter` で絞り込む

```js
const users = [
  { name: "Alice", age: 24 },
  { name: "Bob", age: 17 },
  { name: "Carol", age: 31 },
  { name: "Dave", age: 15 },
];
// 18歳以上のユーザーだけを新しい配列として取り出してください
```

```js
// 自分の回答
const users = [
  { name: "Alice", age: 24 },
  { name: "Bob", age: 17 },
  { name: "Carol", age: 31 },
  { name: "Dave", age: 15 },
];

// 新しい配列を変数に格納する必要はない
const selectedUsers = users.filter((user) => {
  return user.age >= 18;
});
console.log(selectedUsers)
```

<details>
<summary>解答例</summary>

```js
const adults = users.filter((user) => user.age >= 18);
console.log(adults);
// [{ name: "Alice", age: 24 }, { name: "Carol", age: 31 }]
```

</details>

---

## 課題3: `map` + `filter` の組み合わせ

```js
const products = [
  { name: "Apple", price: 120 },
  { name: "Banana", price: 80 },
  { name: "Cherry", price: 300 },
  { name: "Date", price: 500 },
];
// 200円以下の商品名だけを配列で取り出してください
// 期待値: ["Apple", "Banana"]
```

```js
// 自分の回答
const products = [
  { name: "Apple", price: 120 },
  { name: "Banana", price: 80 },
  { name: "Cherry", price: 300 },
  { name: "Date", price: 500 },
];
// 記述が冗長
// const selectedProducts = products.filter((product) => product.price <= 200)
// const underPriceProductsName = selectedProducts.map((selectedProduct) => selectedProduct.name)
const underPriceProductsNames = products.filter((product) => product.price <= 200).map((product) => product.name)
console.log(underPriceProductsNames)
```

<details>
<summary>解答例</summary>

```js
const cheapNames = products
  .filter((product) => product.price <= 200)
  .map((product) => product.name);
console.log(cheapNames); // ["Apple", "Banana"]
```

</details>

---

## Step 3 — ソートアプリの前段階（実装練習）

`filter` と `sort` を使って、商品を価格順に並べる関数を書く。

```js
const items = [
  { name: "Pen", price: 150 },
  { name: "Notebook", price: 300 },
  { name: "Eraser", price: 80 },
  { name: "Ruler", price: 200 },
];
// 価格の安い順に並べて出力してください
```

```js
// 自分の回答
const items = [
  { name: "Pen", price: 150 },
  { name: "Notebook", price: 300 },
  { name: "Eraser", price: 80 },
  { name: "Ruler", price: 200 },
];
const sortedItems = items.map((item) => item).sort((a, b) => a.price - b.price)
console.log(sortedItems)
```

<details>
<summary>解答例</summary>

```js
const sorted = [...items].sort((a, b) => a.price - b.price);
console.log(sorted);
// [
//   { name: "Eraser", price: 80 },
//   { name: "Pen", price: 150 },
//   { name: "Ruler", price: 200 },
//   { name: "Notebook", price: 300 },
// ]
```

> **ポイント:** `items.sort()` は元の配列を破壊的に変更する。`[...items]` でコピーしてから `sort` するのが安全。

</details>
