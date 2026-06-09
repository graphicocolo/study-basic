# JavaScript Map

## Map とは

キーと値のペアを管理するデータ構造。

- [Map](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Map() コンストラクター](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map/Map)

オブジェクト `{}` に似ているが、キーに文字列以外も使える点が異なる。

## 基本的な使い方

```js
const map = new Map();

map.set("a@example.com", { valid: true });
map.set("bad-email",     { valid: false, error: "エラーメッセージ" });

map.get("a@example.com");  // → { valid: true }
map.has("bad-email");      // → true
map.size;                  // → 2
```

## TypeScript での型注釈

```typescript
Map<キーの型, 値の型>
Map<string, EmailValidationResult>
```

## `[キー, 値]` の配列から Map を作る

`new Map()` のコンストラクタに `[キー, 値]` のペアの配列を渡すと Map に変換できる。

```js
new Map([
  ["a@b.com", { valid: true }],
  ["bad",     { valid: false, error: "..." }],
]);
// → Map { "a@b.com" => { valid: true }, "bad" => { valid: false, ... } }
```

## ループ

### `for...of`（最もよく使う）

```js
for (const [key, value] of map) {
  console.log(key, value);
}
```

### キーだけ・値だけ

```js
for (const key of map.keys()) { ... }
for (const value of map.values()) { ... }
```

### `forEach`

```js
map.forEach((value, key) => {
  console.log(key, value);
});
// 注意: 引数の順番が (値, キー) で、配列の forEach と逆
```

## スプレッドで配列に変換して使う

`[...map]` で `[キー, 値][]` の配列に変換でき、`map` や `filter` などの配列メソッドが使える。

```js
// 整形する
const formatted = [...map].map(([email, result]) => ({
  email,
  valid: result.valid,
  error: result.error ?? "なし",
}));

// エラーのあるものだけ抽出して整形
const errors = [...map]
  .filter(([, result]) => !result.valid)  // キーが不要なときは省略できる
  .map(([email, result]) => ({
    email,
    error: result.error,
  }));
```

## Map vs オブジェクト `{}`

| | オブジェクト `{}` | Map |
|---|---|---|
| キーの型 | 文字列のみ | 何でもOK |
| 件数確認 | `Object.keys(obj).length` | `map.size` |
| 順序の保証 | 保証されない | 挿入順が保証される |
| ループ | やや面倒 | `for...of` で扱いやすい |
