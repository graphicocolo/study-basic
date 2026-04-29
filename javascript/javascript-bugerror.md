# JavaScript バグ・エラーに繋がる事例

## `{}` の有無で戻り値が変わる

`{}` なし → 式の値がそのまま戻り値になる（暗黙の return）

```javascript
const double = (n) => n * 2;
double(3); // → 6
```

`{}` あり → 関数ブロックになるので、`return` を書かないと `undefined` が返る

```javascript
const double = (n) => { n * 2 };  // return がない
double(3); // → undefined

const double = (n) => { return n * 2 };  // return あり
double(3); // → 6
```

`map` との組み合わせで起きやすい：

```javascript
// NG: return がないので tasks = [undefined, undefined, ...]
tasks = tasks.map((task) => {
  task.id === id ? { ...task, done: !task.done } : task
});

// OK: {} を外すと式の結果がそのまま戻り値になる
tasks = tasks.map((task) =>
  task.id === id ? { ...task, done: !task.done } : task
);
```

## `{}` をオブジェクトリテラルと間違えやすい

```javascript
// NG: {} がブロックとして解釈される
(task) => { id: 1, title: "test" }

// OK: () で包むとオブジェクトリテラルとして解釈される
(task) => ({ id: 1, title: "test" })