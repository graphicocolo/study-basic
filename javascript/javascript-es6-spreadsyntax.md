# JavaScript ES6（ES2015） スプレッド構文

`...` で中身を「展開」または「まとめる」構文。配列やオブジェクトをバラす・くっつける操作がシンプルに書ける

- スプレッド構文とは - 一言で、基本の形
- 配列での使い方 - コピー、結合、要素の追加
- オブジェクトでの使い方 - コピー、マージ、プロパティの上書き
- レスト構文との違い - 見た目は同じ `...` だが役割が逆
- 実務でよく使うパターン5つ - 配列のイミュータブル操作、オブジェクトの部分更新、関数引数、残余引数、プロパティの除外
- 注意点 - シャローコピー
- まとめ表と参照リンク

---

## スプレッド構文とは

**一言で言うと：`...` を使って、配列やオブジェクトの中身をバラバラに展開する構文**

```js
const nums = [1, 2, 3];
console.log(...nums); // 1 2 3（配列の中身がバラバラに展開された）
```

ES6 より前は `apply` や手動ループで書いていた処理が、`...` だけで済むようになった

---

## 配列での使い方

### コピー

```js
const original = [1, 2, 3];
const copy = [...original];

console.log(copy); // [1, 2, 3]

// コピーなので元の配列に影響しない
copy.push(4);
console.log(original); // [1, 2, 3]（変わらない）
console.log(copy);     // [1, 2, 3, 4]
```

### 結合

```js
const front = [1, 2];
const back = [3, 4];
const merged = [...front, ...back];

console.log(merged); // [1, 2, 3, 4]
```

従来の `concat` より直感的に書ける

```js
// 従来
const merged = front.concat(back);

// スプレッド構文
const merged = [...front, ...back];
```

### 要素の追加

```js
const nums = [2, 3, 4];

// 先頭に追加
const withFirst = [1, ...nums];
console.log(withFirst); // [1, 2, 3, 4]

// 末尾に追加
const withLast = [...nums, 5];
console.log(withLast); // [2, 3, 4, 5]

// 途中に挿入
const withMiddle = [1, ...nums, 5, 6];
console.log(withMiddle); // [1, 2, 3, 4, 5, 6]
```

---

## オブジェクトでの使い方

### コピー

```js
const user = { name: "田中", age: 25 };
const copy = { ...user };

console.log(copy); // { name: "田中", age: 25 }

// コピーなので元のオブジェクトに影響しない
copy.age = 30;
console.log(user); // { name: "田中", age: 25 }（変わらない）
```

### マージ（結合）

```js
const defaults = { color: "blue", size: "medium", theme: "light" };
const custom = { color: "red", size: "large" };

const settings = { ...defaults, ...custom };
console.log(settings); // { color: "red", size: "large", theme: "light" }
```

ポイント：**後に書いたほうが勝つ**（同じキーがあれば上書きされる）

### プロパティの追加・上書き

```js
const user = { name: "田中", age: 25 };

// プロパティを追加
const withEmail = { ...user, email: "tanaka@example.com" };
console.log(withEmail); // { name: "田中", age: 25, email: "tanaka@example.com" }

// プロパティを上書き
const older = { ...user, age: 26 };
console.log(older); // { name: "田中", age: 26 }
```

---

## レスト構文との違い

見た目は同じ `...` だが、**役割が真逆**

| | スプレッド | レスト |
|---|---|---|
| 役割 | 展開する（バラす） | まとめる（集める） |
| 使う場所 | 代入の**右辺**、引数の**渡す側** | 代入の**左辺**、引数の**受け取る側** |

- スプレッド → 広げる、バラす（展開）：[...arr] のように右辺で使う
- レスト → 残りを受け止める、まとめる（収集）：[first, ...rest] = arr のように左辺で使う

```js
// スプレッド：展開する（右辺で使う）
const all = [1, 2, 3, 4, 5];
const newArray = [...all, 6]; // 配列を展開して新しい配列を作る

// レスト：まとめる（左辺で使う）
const [first, second, ...rest] = all;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]（残りをまとめる）
```

オブジェクトでも同じ考え方

```js
const user = { name: "田中", age: 25, email: "tanaka@example.com" };

// レスト：指定したもの以外をまとめる
const { email, ...profile } = user;
console.log(email);   // "tanaka@example.com"
console.log(profile); // { name: "田中", age: 25 }
```

---

## 実務でよく使うパターン

### 1. 配列のイミュータブルな操作（React で頻出）

```js
const todos = [
  { id: 1, text: "買い物" },
  { id: 2, text: "掃除" },
];

// 追加（元の配列を変更せず新しい配列を作る）
const added = [...todos, { id: 3, text: "料理" }];

// 削除（filter と組み合わせ）
const removed = todos.filter(todo => todo.id !== 1);

// 更新（map と組み合わせ）
const updated = todos.map(todo =>
  todo.id === 2 ? { ...todo, text: "大掃除" } : todo
);
```

### 2. オブジェクトの部分更新（state 更新で頻出）

```js
const state = { name: "田中", age: 25, score: 80 };

// age だけ更新、他はそのまま
const newState = { ...state, age: 26 };
console.log(newState); // { name: "田中", age: 26, score: 80 }
```

### 3. 関数の引数に配列を展開して渡す

```js
const scores = [65, 80, 92, 45, 78];

// Math.max は引数を個別に受け取る関数
// Math.max([65, 80, 92, 45, 78]) → NaN（配列は渡せない）
// Math.max(65, 80, 92, 45, 78)   → 92（個別なら OK）

const highest = Math.max(...scores);
console.log(highest); // 92

// 従来は apply を使っていた
// Math.max.apply(null, scores);
```

### 4. 関数の残余引数（レスト構文）

```js
// 引数の数が不定の関数
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2));       // 3
console.log(sum(1, 2, 3, 4)); // 10

// 最初の引数だけ特別扱いしたいとき
function log(label, ...messages) {
  messages.forEach(msg => console.log(`[${label}] ${msg}`));
}

log("INFO", "開始", "処理中", "完了");
// [INFO] 開始
// [INFO] 処理中
// [INFO] 完了
```

### 5. オブジェクトから特定プロパティを除外する（レスト構文）

```js
const response = { id: 1, name: "田中", password: "secret", role: "admin" };

// password を除外して残りだけ使う
const { password, ...safeData } = response;
console.log(safeData); // { id: 1, name: "田中", role: "admin" }
```

API レスポンスからパスワードなどの機密情報を除外する場面でよく使われる

---

## 注意点：シャローコピー（浅いコピー）

スプレッド構文のコピーは**1階層目だけ**。ネストしたオブジェクトは参照が共有される

```js
const user = {
  name: "田中",
  address: { city: "東京", zip: "100-0001" },
};

const copy = { ...user };

// 1階層目は独立している
copy.name = "鈴木";
console.log(user.name); // "田中"（影響なし ✅）

// ネストしたオブジェクトは参照が同じ
copy.address.city = "大阪";
console.log(user.address.city); // "大阪"（元も変わってしまう ⚠️）
```

ネストしたオブジェクトもコピーしたい場合

```js
// 手動でネスト部分もスプレッドする
const deepCopy = {
  ...user,
  address: { ...user.address },
};

// または structuredClone を使う（モダンブラウザ対応）
const deepCopy = structuredClone(user);
```

---

## まとめ

| ポイント | 内容 |
|---|---|
| 基本 | `...` で配列やオブジェクトの中身を展開する |
| 配列コピー | `const copy = [...arr]` |
| 配列結合 | `const merged = [...arr1, ...arr2]` |
| オブジェクトコピー | `const copy = { ...obj }` |
| オブジェクトマージ | `const merged = { ...obj1, ...obj2 }`（後が優先） |
| レスト構文 | `const [first, ...rest] = arr`（残りをまとめる） |
| 注意 | シャローコピー。ネストした中身は参照が共有される |

## 参照

- [スプレッド構文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [残余引数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [structuredClone](https://developer.mozilla.org/ja/docs/Web/API/Window/structuredClone)
