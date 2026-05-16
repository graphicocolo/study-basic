# JavaScript 配列

## 配列の複製

配列を別の変数に代入する時、配列への参照を代入することになる

配列の実体は別にある

参照を代入するだけでは、同じ実体を指してしまう

```js
const origin = ["one", "two", "three"];

const arr = origin; // 参照を代入
const arr2 = arr; // 参照を複製して代入
arr[0] = "zero";
console.log(origin); // [ 'zero', 'two', 'three' ]
```

配列の内容の複製を行うにはいくつか方法がある

```js
const origin = ["one", "two", "three"];

// 参照先がそれぞれ別々になる
const arr = [...origin]; // スプレッド構文
const arr2 = origin.concat();
const arr3 = origin.slice();

origin[2] = "third";
console.log(origin); // [ 'one', 'two', 'third' ]
console.log(arr); // [ 'one', 'two', 'three' ]
console.log(arr2); // [ 'one', 'two', 'three' ]
console.log(arr3); // [ 'one', 'two', 'three' ]
```

### シャローコピー

配列を複製すると参照だけが複製される

参照のみの複製のため、元の参照と複製された参照の先にある実体は同一のものである

参照のみの複製をシャローコピーという

### ディープコピー

参照の先も複製することをディープコピーという

#### ディープコピーの方法

**`JSON.parse(JSON.stringify(obj))`**

```js
const origin = { a: 1, b: { c: 2 } };
const copy = JSON.parse(JSON.stringify(origin));

copy.b.c = 99;
console.log(origin.b.c); // 2 ← 影響なし
```

コピーできないもの：

| 値 | 結果 |
|---|---|
| `Date` | 文字列に変換される |
| `undefined` | プロパティごと消える |
| 関数 | プロパティごと消える |
| `Symbol` | プロパティごと消える |
| 循環参照 | エラーになる |

シンプルな数値・文字列・オブジェクトだけなら使える

**`structuredClone()`**

```js
const origin = { a: 1, b: { c: 2 } };
const copy = structuredClone(origin);

copy.b.c = 99;
console.log(origin.b.c); // 2 ← 影響なし

// Date もちゃんとコピーされる
const obj = { date: new Date() };
const copy2 = structuredClone(obj);
console.log(copy2.date instanceof Date); // true
```

`JSON` 方式より対応範囲が広い。コピーできないのは関数・`Symbol`・独自クラスのインスタンスのみ。
ライブラリなしで使える現実的な第一選択肢。

**`lodash.cloneDeep()`**

```js
import cloneDeep from 'lodash/cloneDeep';

const origin = { fn: () => "hello", b: { c: 2 } };
const copy = cloneDeep(origin);

console.log(copy.fn()); // "hello" ← 関数もコピーされる
```

npm ライブラリとして lodash をインストールする必要がある。関数やクラスインスタンスも含む複雑なデータに対応。

#### 選び方

```
シンプルなデータ（数値・文字列のみ）
  → JSON.parse(JSON.stringify())

Date や循環参照を含むが、関数はない
  → structuredClone()  ← 迷ったらこれ

関数・クラスインスタンスも含む
  → lodash.cloneDeep()
```

- [Deep copy (ディープコピー)](https://developer.mozilla.org/ja/docs/Glossary/Deep_copy)
- [Window: structuredClone() メソッド](https://developer.mozilla.org/ja/docs/Web/API/Window/structuredClone)

## 配列の操作

### 非破壊的配列操作メソッド

**スプレッド構文 / slice**

```js
const arr = [1, 2, 3, 4, 5];

// スプレッド構文
const newArr = [...arr, 6];
console.log(newArr); // [1, 2, 3, 4, 5, 6]

// slice(start, end): 元の配列を変えず、一部を切り出した新しい配列を返す
const result = arr.slice(1, 3);
console.log(result); // [2, 3]
console.log(arr);    // [1, 2, 3, 4, 5] ← 変わらない
```

[Array.prototype.slice()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

### 破壊的配列操作メソッド

**push / pop**

他、splice, sort など

```js
const arr = [1, 2, 3];

// push: 末尾に追加（元の配列を変更）
arr.push(4);
console.log(arr); // [1, 2, 3, 4]

// pop: 末尾を削除して返す（元の配列を変更）
const removed = arr.pop();
console.log(removed); // 4
console.log(arr);     // [1, 2, 3]
```

1. 意図しない副作用 — 同じ配列を複数箇所で参照していると、思わぬところで値が変わる
2. Reactでは特に重要 — Reactは「前の状態と比較して変化があれば再レンダリング」する仕組みのため、元の配列を変更すると変化を検知できないことがある

### `split()`

文字列 → 配列 に変換するStringのメソッド

[String.prototype.split()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split)

> パターンを受け取り、この文字列をパターン検索によって部分文字列の順序付きリストに分割し、これらの部分文字列を配列に入れ、その配列を返します。

```js
const str = "a,b,c";
str.split(","); // ["a", "b", "c"]
```

### `join()`

`split()` の逆が `join()` 配列 → 文字列

[Array.prototype.join()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/join)

```js
const arr = ["a", "b", "c"];
arr.join(",");  // "a,b,c"
arr.join("-");  // "a-b-c"
arr.join("");   // "abc"
```

### `sort()`

> 既定のソート順は昇順で、要素を文字列に変換してから、 UTF-16 コード単位の値の並びとして比較します。

破壊的メソッド

[Array.prototype.sort()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)