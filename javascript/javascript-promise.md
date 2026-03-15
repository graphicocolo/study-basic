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

## Promise

Promise は「非同期処理の結果を扱うためのオブジェクト」**

```js
const p = new Promise((resolve) => setTimeout(() => resolve('完了'), 1000))
// この時点では待っていない。p は Promise オブジェクトとして即座に返る

const result = await p
// ← await が「ここで待つ」という命令。Promise 単体では待たない
```

| | 役割 |
|---|---|
| `Promise` | 非同期処理の結果を入れる箱 |
| `await` | その箱が開くまで待つ |
| `Promise.all` | 複数の箱を並列で処理し、全部開いたらまとめて返す |

Promise.all で複数の処理を並列実行し、await で全部完了するまで待つ

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

## Promise.all

**複数の Promise を並列で実行し、全部完了したら結果をまとめて受け取る**メソッド。

```js
Promise.all([promise1, promise2, promise3])
  .then(([result1, result2, result3]) => {
    // 全部成功したときだけここに来る
  })
  .catch((error) => {
    // どれか1つでも失敗したらここに来る
  })
```

---

### 逐次実行 vs 並列実行

```js
// 疑似的な「時間のかかる処理」
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: `ユーザー${id}` }), 1000)
  })
}
```

**逐次実行（await を直列に書く）→ 3秒かかる**

```js
async function sequential() {
  const user1 = await fetchUser(1)  // 1秒待つ
  const user2 = await fetchUser(2)  // さらに1秒待つ
  const user3 = await fetchUser(3)  // さらに1秒待つ
  console.log(user1, user2, user3)  // 合計3秒
}
```

**並列実行（Promise.all）→ 1秒で済む**

```js
async function parallel() {
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1),  // 同時に開始
    fetchUser(2),  // 同時に開始
    fetchUser(3),  // 同時に開始
  ])
  console.log(user1, user2, user3)  // 合計1秒（最も遅い処理に合わせる）
}
```

---

### 失敗したときの挙動

**1つでも失敗すると即座に reject される（他の処理は止まらないが結果は捨てられる）**

```js
Promise.all([
  Promise.resolve('成功A'),
  Promise.reject('失敗B'),   // ← これが失敗
  Promise.resolve('成功C'),
])
  .then((results) => console.log(results))  // 呼ばれない
  .catch((error) => console.log(error))     // '失敗B'
```

---

### 関連メソッドとの比較

| メソッド | 挙動 |
|----------|------|
| `Promise.all` | 全部成功したら結果を返す。1つでも失敗したら即 reject |
| `Promise.allSettled` | 全部の結果（成功・失敗問わず）を返す |
| `Promise.race` | 最初に完了した1つの結果だけを返す |
| `Promise.any` | 最初に**成功した**1つの結果だけを返す |

### 練習課題

以下のコードを書いてみてください。

```js
// 1. 3つの「n ミリ秒後に値を返す Promise」を作る関数を用意する
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// 2. Promise.all で並列実行し、全結果を console.log する
async function parallel() {
  const [fruit1, fruit2, fruit3] = await Promise.all([
    delay(1000, 'りんご'),
    delay(1000, 'バナナ'),
    delay(1000, 'みかん'),
  ])
  console.log(fruit1, fruit2, fruit3)
}

parallel()

// 3. 途中に失敗する Promise を混ぜて、catch で受け取る
async function parallel() {
  try {
    const [fruit1, fruit2, fruit3] = await Promise.all([
      delay(1000, 'りんご'),
      Promise.reject('バナナ失敗'),
      delay(1000, 'みかん'),
    ])
    console.log(fruit1, fruit2, fruit3)
  } catch (error) {
    console.log('エラー:', error)  // 'バナナ失敗'
  }
}

parallel()

// もしくは
function parallel() {
  Promise.all([
    delay(1000, 'りんご'),
    Promise.reject('バナナ失敗'),
    delay(1000, 'みかん'),
  ])
    .then((result) => console.log(result))
    .catch((error) => console.log('エラー:', error))  // 'バナナ失敗'
}

parallel()
```

---

## async/await と Promise の関係

**async/await は Promise を使いやすく書くための構文糖衣（シンタックスシュガー）**。内部では Promise が動いている。

---

### 同じ処理を両方で書くと

```js
// Promise チェーンで書いた版
function getUser() {
  return fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      console.log(data.name)
    })
    .catch(function(error) {
      console.log('エラー:', error)
    })
}
```

```js
// async/await で書いた版（やっていることは全く同じ）
async function getUser() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
    const data = await response.json()
    console.log(data.name)
  } catch (error) {
    console.log('エラー:', error)
  }
}
```

---

### 2つのキーワードの意味

**`async`**：この関数は必ず Promise を返す、という宣言

```js
async function hello() {
  return 'こんにちは'
}

hello()  // → Promise { 'こんにちは' }（文字列ではなく Promise が返る）
```

**`await`**：Promise が解決されるまでここで待つ、という命令

```js
async function hello() {
  const result = await Promise.resolve('こんにちは')
  console.log(result)  // 'こんにちは'（Promise ではなく中身が取り出せる）
}
```

`await` は `async` 関数の中でしか使えない。

---

### `.catch` と `try/catch` の対応

```js
// Promise の .catch
somePromise
  .catch((error) => console.log(error))

// async/await の try/catch（同じ意味）
try {
  await somePromise
} catch (error) {
  console.log(error)
}
```

---

### まとめ

| | Promise チェーン | async/await |
|---|---|---|
| 中身 | Promise そのもの | Promise のラッパー |
| エラー処理 | `.catch()` | `try/catch` |
| 読みやすさ | 慣れが必要 | 同期処理に近い見た目 |

「Promise が理解できていれば、async/await は書き方が変わるだけ」。`Promise.all` で `await` を使う場合も、内部では Promise が動いている。

---

## 参照

- [Promise - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [fetch - MDN](https://developer.mozilla.org/ja/docs/Web/API/fetch)
- [jsonplaceholder](https://jsonplaceholder.typicode.com/)（練習用の無料テストAPI）
