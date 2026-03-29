# JavaScript エラーハンドリング（try/catch）

## try/catch の基本形

try ブロック内でエラーが起きると、catch ブロックに処理が移る

エラーが起きなければ catch はスキップされる

```js
function divide(a, b) {
  try {
    if (b === 0) {
      throw new Error("0で割ることはできません");
    }
    console.log("結果:", a / b);
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
  }
}

divide(10, 2);  // 結果: 5
divide(10, 0);  // エラーが発生しました: 0で割ることはできません
```

---

## Error オブジェクトを観察する

catch で受け取る error には以下のプロパティがある

error.message : エラーの説明文

error.name    : エラーの種類（"Error", "TypeError" など）

```js
try {
  null.toString(); // null のプロパティにはアクセスできない → TypeError
} catch (error) {
  console.log("error.name    :", error.name);    // TypeError
  console.log("error.message :", error.message); // Cannot read properties of null...
}
```

---

## finally — 成功・失敗どちらでも実行される

finally は try/catch の後に必ず実行されるブロック

「通信中...」を消す、ローディング表示をOFFにする、などに使う

```js
function fetchWithFinally() {
  console.log("通信開始");
  try {
    throw new Error("サーバーエラー");
  } catch (error) {
    console.error("エラー:", error.message);
  } finally {
    console.log("通信終了（成功でも失敗でも実行される）");
  }
}

fetchWithFinally();
// 通信開始
// エラー: サーバーエラー
// 通信終了（成功でも失敗でも実行される）
```

---

## fetch 特有のエラーハンドリング

fetch で注意が必要な点：
  - ネットワークエラー（通信できない）→ catch で捕捉できる
  - HTTPエラー（404 / 500 など）     → catch では捕捉できない！
    → fetch は 404 でも Promise を reject しないため
    → response.ok または response.status で自分でチェックする必要がある

```js
async function fetchTodo(id) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

    // HTTPエラーを自分で検出する
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();
    console.log("取得成功:", data);
  } catch (error) {
    console.error("エラー:", error.message);
  }
}

fetchTodo(1);    // 取得成功: {userId: 1, id: 1, ...}
fetchTodo(9999); // HTTPエラー: 404（存在しないID）
```

---

## 復習

Q: fetch で 404 が返ってきたとき、なぜ catch だけでは捕捉できないの？
A: 404 はネットワークエラーではなく、HTTP エラーだから。fetchはHTTPエラーでもPromiseをrejectしない仕様のため

Q: response.ok とは何？どんな値のとき true になる？
A: response.ok とは、API からレスポンスが返ってきた状態のこと
200〜299 のとき true となる。404 や 500 では false となる

Q: finally はどんな場面で使うと便利？
A: API データ取得後に必ず行いたい処理がある場合に使用すると便利（例えばローディング表示の終了など）

---

## 早期リターンとエラーハンドリングの違い

広い意味では同じ「異常系の処理」だが、厳密には別の概念。

**エラーハンドリング** は、予期しない状態（例外・通信失敗など）が起きたときに処理を「捕捉・回復・通知」することが目的。

```js
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
} catch (error) {
  console.error(error.message); // 捕捉して通知
}
```

**早期リターン** は、条件を満たさない場合にその先の処理をスキップすることが目的。エラーとは限らない。

```js
function listInsertData(data, listElement) {
  if (data.length === 0) return; // 空なら何もしない（エラーではない）
  // ...
}
```

| | 目的 | エラー前提？ |
|---|---|---|
| エラーハンドリング | 例外を捕捉・回復・通知する | はい |
| 早期リターン | 不要な処理をスキップする | 必ずしもそうではない |

早期リターンがエラーハンドリングになるのは、「無効な値が来たとき関数を抜ける」ような場面。

```js
function divide(a, b) {
  if (b === 0) {
    console.error("0で割れません"); // エラーとして扱っている
    return;
  }
  return a / b;
}
```

この場合は早期リターン＋エラーハンドリングの両方の性質を持つ。

---

## 異常系の処理

学習段階では `console.error` でメッセージを表示することで対応するが、実際のプロダクトではほぼ必ずエラー監視サービスを使う。

**フロントエンド（ブラウザ）の場合**

`console.error` はブラウザの開発者ツールにしか出ないため、本番ではユーザーのエラーを把握できない。そこで **エラー監視サービス** を使う。

代表的なものは **Sentry**。

```js
// console.error の代わりに Sentry に送る
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`);
} catch (error) {
  Sentry.captureException(error); // Sentryのサーバーにエラーを送信
}
```

Sentry に送ると、エラーの発生回数・ユーザー環境・スタックトレースなどが管理画面で確認できる。

**ユーザーへの見せ方も変わる**

学習段階では `console.error` で確認するが、本番ではユーザーにはUIでメッセージを表示する。

```js
catch (error) {
  Sentry.captureException(error);        // 開発者向け：ログに記録
  showErrorMessage("通信に失敗しました"); // ユーザー向け：画面に表示
}
```

| | 学習段階 | 本番プロダクト |
|---|---|---|
| 開発者への通知 | `console.error` | Sentry などのエラー監視 |
| ユーザーへの通知 | （なし） | UIにエラーメッセージを表示 |

---

## 参照

- []()
