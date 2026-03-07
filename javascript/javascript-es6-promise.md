# JavaScript ES6（ES2015） Promise

## まず非同期処理とは何か

時間のかかる処理の完了を待たずに、次の処理を先に進めること

```js
// 同期処理（上から順に止まって待つ）
const data = サーバーからデータ取得() // ← ここで数秒止まる
console.log(data)
console.log("次の処理")

// 非同期処理（待たずに次へ進む）
// サーバーからデータ取得(完了したら呼んでね)  // ← 待たずに次へ
console.log("次の処理")
```

この「完了したら呼んでね」の仕組みが昔はコールバック関数でした。Promiseはそのコールバックの問題を解決するために生まれました。

## Promise が生まれた理由

コールバック関数は、処理が連続すると**コールバック地獄**になる。

```js
// コールバック地獄の例
データ取得(function(data) {
  加工する(data, function(result) {
    保存する(result, function(saved) {
      通知する(saved, function() {
        // どんどんネストが深くなる...
      })
    })
  })
})
```

Promiseはこれを**フラットに書ける**ようにしたもの。

```js
// Promiseで書くと
データ取得()
  .then(data => 加工する(data))
  .then(result => 保存する(result))
  .then(saved => 通知する(saved))
```


## 参照

- [Promise](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)
