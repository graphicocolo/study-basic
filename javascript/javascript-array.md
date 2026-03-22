# JavaScript 配列

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