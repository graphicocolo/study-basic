# 繰り返し処理 / filter / sort

## 頻出

| 優先度 | 記法 | 諦める時の理由 |
| ---- | ---- | ---- |
| 1 | map/filter/find | 効率のため、一つのループの中で複数の意味付けの処理を行いたかったり、意味合いがまとめられない場合は次を検討する |
| 2 | for...of | インデクスが必要だったり、処理を関数スコープで閉じたい理由があれば次を検討する |
| 3 | forEach | 配列の要素を繰り返すのではない場合には次を検討する |
| 4 | for |  |

### 目的による使い分け

| メソッド | 目的 | 戻り値 |
|----------|------|--------|
| `forEach` | 副作用を起こす（DOM操作・保存など） | なし（`undefined`） |
| `map` | 配列を別の配列に変換する | 新しい配列 |
| `for...of` | どちらにも使える汎用ループ | — |

**`map` を使うべきでないケース**：戻り値の配列を使わない場合。変換結果を捨てるなら `forEach` の方が意図が明確。

```js
// NG：map の結果を使っていない
memos.map((memo) => {
  addMemoToList(memo);
});

// OK：副作用が目的なら forEach
memos.forEach((memo) => {
  addMemoToList(memo);
});
```

**`forEach` より `for...of` を選ぶケース**

| | `forEach` | `for...of` |
|---|---|---|
| `break` / `continue` | 使えない | 使える |
| `await` との相性 | 悪い | 良い |
| 配列以外（Map・Set など） | 不可 | 可 |

### 副作用（Side Effect）とは

「**関数の外の状態を変えること**」。関数本来の仕事（値を受け取って値を返す）以外の影響を外に与えることを指す。

```js
// 副作用なし：受け取った値を計算して返すだけ
function double(n) {
  return n * 2;
}

// 副作用あり：外の DOM を変更している
function showMessage(text) {
  document.querySelector("#status").textContent = text;
}

// 副作用あり：外の localStorage を変更している
function saveMemo(memo) {
  localStorage.setItem("memo", memo);
}
```

DOM操作・localStorage・APIリクエスト・`console.log` なども副作用に含まれる。

**`forEach` が「副作用向き」と言われる理由**：`forEach` は戻り値が `undefined` の設計で、「外への影響（副作用）を起こすためのループ」という意図が最初から明確になっている。戻り値を使わないのに `map` を使うのは意図が伝わりにくい。

**React の `useEffect` との繋がり**：`useEffect` が「副作用を扱うフック」と説明されるのも同じ意味。コンポーネントの本来の仕事は「状態を受け取って画面を返すこと」で、それ以外の外への影響（API通信・DOM操作・localStorage）を副作用と呼び、`useEffect` に分離して書く。

| | 説明 | 例 |
|---|---|---|
| 副作用なし | 受け取って返すだけ | 計算・変換・フィルター |
| 副作用あり | 外の状態を変える | DOM操作・localStorage・API通信・console.log |

> 「副作用」はネガティブな言葉ではなく、**「関数の外に影響を与える処理」を指す中立的な技術用語**。

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

---

## 実践例

### 一定の決まりを持つ複数行テキストの変換

**旧コード**

```js
function transformLines(input) {
  return input
    // 行末の（数字p）を削除（全角カッコ）
    .replace(/（\d+p）/g, "")
    // ● を ・ に変換
    .replace(/●/g, "・")
    // 改行2つ以上 → 1つに
    .replace(/\n{2,}/g, "\n")
    // 行ごとに処理
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^・$/.test(trimmed)) return ""; // 空文字行の場合、改行が出力されてしまう

      const processed = trimmed.startsWith("■") ? `<h3 class="trn03">${trimmed}</h3>` : `<p>${trimmed}</p>`;
      
      return processed;
    })
    .join("\n");
}
```

**修正コード**

continue → 次のループへ進む

break → ループ自体を終了する

なので注意

```js
function transformLines(input) {
  const lines = input
    .replace(/（\d+p）/g, "")
    .replace(/●/g, "・")
    .replace(/\n{2,}/g, "\n")
    .split("\n"); // split では配列が返る

  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    // ・だけの行は無視して次へ
    if (/^・+$/.test(trimmed)) continue;

    // ■で始まる行
    if (trimmed.startsWith("■")) {
      result.push(`<h3 class="trn03">${trimmed}</h3>`);
      continue;
    }

    // 通常行
    result.push(`<p>${trimmed}</p>`);
  }

  return result.join("\n"); // 返り値は改行でつないだ文字列
}
```

---

# 🎯 結論（最重要ポイント）
**map は「1行 → 1行」の独立処理向き。  
for は「行と行の関係」を扱う処理向き。**

今回のように  
- 「・だけの行は無視して次の行へ進む」  
- 「前後の行の状態を見ながら処理したい」  
という場合は **for の方が自然で安全**。

---

# 🧭 map を使うべきケース

### ✔ 1. 各行を“独立して”変換するだけのとき
例：
- 行頭が「■」なら `<h3>` にする
- それ以外は `<p>` にする
- 空行は空文字にする

こういう **「入力1 → 出力1」** の単純変換は map が最適。

### ✔ 2. 行の順番やスキップが問題にならないとき
map は「配列の長さを変えない」ので、  
- スキップ  
- 結合  
- 前後の行を参照  
などが不要な場合に向いている。

### ✔ 3. 関数型スタイルで書きたいとき
map は宣言的で読みやすいので、  
「変換処理をきれいに書きたい」場合に向く。

---

# 🧭 for を使うべきケース（今回はこちら）

### ✔ 1. 行を“スキップ”したいとき
今回のように：

```
・だけの行 → 出力しないで次へ
```

map では「スキップ」が不自然。  
for なら `continue` で自然に書ける。

### ✔ 2. 行と行の関係を扱いたいとき
例：
- 「・だけの行が続いたら全部無視」
- 「次の行と結合したい」
- 「前の行が見出しなら次の行を特別扱い」

こういう **状態管理** が必要な処理は for が圧倒的に書きやすい。

### ✔ 3. 配列の長さが変わる処理
map は必ず「同じ長さの配列」を返す。  
for は自由に push できるので、  
- スキップ  
- 結合  
- 分割  
などが自在。

### ✔ 4. 処理の流れを明確にしたいとき
for は「逐次処理」なので、  
- 何をスキップしたか  
- どこで push したか  
が読みやすい。

---

# 📝 今回のケースに当てはめると

### map が向かない理由
- 「・だけの行を無視して次へ」という **スキップ処理** が必要  
- 行ごとの独立処理ではなく、**前後の行の関係**がある  
- map だと「空文字を返す」しかできず、配列の長さが変わらない

### for が向いている理由
- `continue` で自然にスキップできる  
- 必要な行だけ `result.push()` できる  
- 行の状態を見ながら処理できる

---

# 📌 まとめ（短く）

| 目的 | map | for |
|------|------|------|
| 各行を独立して変換 | ◎ | ○ |
| 行をスキップしたい | △（不自然） | ◎ |
| 行と行の関係を扱う | × | ◎ |
| 配列の長さを変えたい | × | ◎ |
| 宣言的に書きたい | ◎ | ○ |
| 状態管理が必要 | × | ◎ |

---

今回の処理は、  
**「行をスキップしつつ、必要な行だけ push する」**  
という典型的な for の領域です。

---

必要なら、  
- reduce を使った関数型スタイル  
- map + filter の組み合わせ  
- for...of でより読みやすくする書き方  
なども紹介できますよ。