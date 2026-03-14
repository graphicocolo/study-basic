# Promise 深掘り

> 基礎は `javascript-es6-promise.md` を参照。ここでは then / catch の実践的な使い方をまとめる。

---

## JavaScript は「待たない」

```js
const data = fetch('https://example.com/data')
console.log(data)  // → Promise { <pending> }
```

`fetch` はデータではなく **Promise オブジェクトを即座に返す**。サーバーの返事を待たずに次の行に進む。

---

## Promise の3つの状態

```
pending  → fulfilled（成功）
         → rejected（失敗）
```

| 状態 | 意味 |
|---|---|
| `pending` | 結果待ち（初期状態） |
| `fulfilled` | 成功した |
| `rejected` | 失敗した |

一度 fulfilled か rejected になったら、もう変わらない。

---

## `.then` / `.catch` の基本

```js
fetch('https://example.com/data')
  .then(function(response) {
    // fulfilled（成功）のときに実行
  })
  .catch(function(error) {
    // rejected（失敗）のときに実行
  })
```

- `.then` と `.catch` は Promise オブジェクトが持つメソッド
- コールバック地獄と違い、ネストではなく縦に並ぶ

---

## `.then` チェーン

`fetch` が返す Response はそのまま使えず、`.json()` で中身を取り出す必要がある。

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(function(response) {
    return response.json()   // Response → Promise<data>
  })
  .then(function(data) {
    return data.title        // data → title（文字列）
  })
  .then(function(title) {
    console.log(title)       // 'delectus aut autem'
  })
```

**ルール：**
- `.then` の中で `return` した値が、次の `.then` の引数に渡される
- Promise を `return` した場合は、その Promise が解決されてから次に進む

---

## `fetch` のエラーハンドリングの落とし穴

`fetch` は **404 や 500 でも fulfilled になる**。サーバーから返事が来れば成功扱い。

| 状況 | fetch の状態 |
|---|---|
| ネットワークエラー（繋がらない） | rejected |
| 200（成功） | fulfilled |
| 404 / 500（サーバーエラー） | fulfilled ← 注意 |

---

## `response.ok` で自分でエラーを検知する

```js
fetch('https://jsonplaceholder.typicode.com/todos/999999')
  .then(function(response) {
    if (!response.ok) {
      throw new Error('取得失敗: ' + response.status)  // 自分で reject させる
    }
    return response.json()
  })
  .then(function(data) {
    console.log(data)
  })
  .catch(function(error) {
    console.log('エラー:', error)
  })
```

- `response.ok`：ステータスコードが 200〜299 のとき `true`
- `throw` すると `.catch` に飛ぶ

| 状況 | `catch` は呼ばれる？ |
|---|---|
| ネットワークエラー | ✅ 呼ばれる |
| 404 / 500（そのまま） | ❌ 呼ばれない |
| `response.ok` チェック + `throw` | ✅ 呼ばれる |

---

## 参照

- [Promise - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [fetch - MDN](https://developer.mozilla.org/ja/docs/Web/API/fetch)
- [jsonplaceholder](https://jsonplaceholder.typicode.com/)（練習用の無料テストAPI）
