# JavaScript async/await 深掘り

## 前提：async/await とは

「Promiseが理解できていれば、async/awaitは書き方が変わるだけ」

async/await は **Promiseのシンタックスシュガー**（糖衣構文）。内部では同じPromiseが動いている。

Promise は、非同期処理をフラットに書けるようにしたもの

---

## 課題1：基本の書き換え

`.then()` チェーンを `async/await` で書き直す。

```js
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "田中" }), 500);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["投稿A", "投稿B", "投稿C"]), 500);
  });
}

// Promise版（これをasync/awaitで書き直す）
fetchUser(1)
  .then((user) => {
    console.log("ユーザー:", user.name);
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log("投稿一覧:", posts);
  });
```

**ポイント：** `async function` の宣言と `await` の置き場所を意識する。

### 自分の回答

```js
async function fetchUserPostsData (id) {
  try {
    const userData = await fetchUser(id)
    console.log("ユーザー:", userData.name)
    const postsData = await fetchPosts(userData.id)
    console.log("投稿一覧:", postsData)
  } catch (error) {
    console.error('エラー:', error)
  }
}

fetchUserPostsData(1)
```

---

## 課題2：エラーハンドリング

`.catch()` を `try/catch` を使った `async/await` に書き直す。

```js
function fetchData(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("データの取得に失敗しました"));
      } else {
        resolve({ data: "成功データ" });
      }
    }, 300);
  });
}

// Promise版（これをasync/awaitで書き直す）
fetchData(true)
  .then((result) => {
    console.log("成功:", result.data);
  })
  .catch((err) => {
    console.error("エラー:", err.message);
  });
```

**ポイント：** `.catch()` が `try/catch` のどこに対応するかを意識する。

### 自分の回答

```js
async function dataDisplay () {
  try {
    const result = await fetchData(true)
    console.log("成功:", result.data)
  } catch (error) {
    console.error('エラー:', error.message)
  }
}

dataDisplay()
```

---

## 課題3：並列処理（応用）

`Promise.all` を `async/await` で書き直す。

```js
function getA() {
  return new Promise((resolve) => setTimeout(() => resolve("A"), 300));
}
function getB() {
  return new Promise((resolve) => setTimeout(() => resolve("B"), 200));
}
function getC() {
  return new Promise((resolve) => setTimeout(() => resolve("C"), 400));
}

// Promise版（これをasync/awaitで書き直す）
Promise.all([getA(), getB(), getC()])
  .then((results) => {
    console.log(results); // ["A", "B", "C"]
  });
```

**ポイント：** `await Promise.all([...])` という形になる。`await` を3つ個別に書いた場合と何が違うか？も考える。

「awaitを3つ個別に書いた場合と何が違うか？」の答え

```js
// これは直列（合計900ms）
const a = await getA() // 300ms待つ
const b = await getB() // さらに200ms待つ
const c = await getC() // さらに400ms待つ

// これは並列（合計400ms）
const [a, b, c] = await Promise.all([getA(), getB(), getC()])
```

await を個別に書くと1つ終わってから次が始まる直列処理になります。Promise.all は3つを同時に開始する並列処理なので、最も遅い処理（400ms）が終わった時点で全部揃います。

### 自分の回答

```js
// 全件ループで処理したいとき
async function parallelDisplay1 () {
  try {
    const results = await Promise.all([getA(), getB(), getC()])
    // results === ["A", "B", "C"]
    console.log(results)
  } catch(error) {
    console.error(error.message)
  }
}

parallelDisplay1()

// 分割代入 を使った書き方
// それぞれの結果を個別の変数として扱いたいときに便利
async function parallelDisplay2 () {
  try {
    const [result1, result2, result3] = await Promise.all([getA(), getB(), getC()])
    console.log(result1, result2, result3)
  } catch(error) {
    console.error(error.message)
  }
}

parallelDisplay2()
```

Promise.all が返す配列の順序は、完了した順ではなく、渡した順が保証されています。

---

## 学習のゴール

| チェック項目 | 確認ポイント |
|---|---|
| `async` を関数につける意味が言える | 戻り値がPromiseになる |
| `await` がどこで使えるか言える | `async` 関数の中だけ |
| `.then()` と `await` の対応が分かる | 書き方が変わるだけ |
| `try/catch` で `.catch()` を代替できる | エラーハンドリング |
| `Promise.all` は `async/await` でも使う | 並列処理はそのまま |

---

## 参照

- [Promise.all()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
