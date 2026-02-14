# JavaScript ES6（ES2015） アロー関数

> 従来の関数式の簡潔な代替構文

```js
// () => {...} がアロー関数
const calcDouble = (data) => {
  return data * 2;
}
console.log(calcDouble(2)); // 4
```

```js
// 従来の関数定義
function displayGreeting() {
  return 'おはようございます！';
}
console.log(displayGreeting());
```

## 色々な書き方

```js
// 省略記法

// 引数が1つなので () を省略
const func1 = val1 => {
  return val1;
};
console.log(func1("引数は1つ")); // 引数は1つ

// 処理が一行なので {} と return を省略
const a = 4;
const b = 2;
const func2 = val2 => a + b;
console.log(func2("処理は一行"));
```

## アロー関数の `this`

アロー関数は、単純に function の置き換えとならないことがある

アロー関数の this の選ばれ方が、function のそれとは異なるため

アロー関数では this が関数を宣言したところで決定され、通常の関数のような所有者の判断が行われない

たとえ話：「自分の名前」を名乗る場面

「私は〇〇です」と自己紹介するとき、this は「私」に相当します。

- 通常の function → 「今いる場所（呼び出し元）」で「私」が変わる
- アロー関数 → 「生まれた場所（書かれた場所）」の「私」をずっと使い続ける

具体例：レストランのスタッフ

```js
const restaurant = {
  name: "イタリアン太郎",

  // ---- 通常の function ----
  greetNormal: function () {
    console.log("いらっしゃいませ！" + this.name + "です！");
  },

  // ---- アロー関数 ----
  greetArrow: () => {
    console.log("いらっしゃいませ！" + this.name + "です！");
  },
};

restaurant.greetNormal(); // いらっしゃいませ！イタリアン太郎です！
restaurant.greetArrow();  // いらっしゃいませ！undefinedです！
```

なぜこうなるか

|    |  通常の function  |  アロー関数  |
| ---- | ---- | ---- |
|  this の決まり方  |  呼ばれたときに決まる  |  書かれた場所で決まる  |
|  上の例では  |  `restaurant.greetNormal() → this = restaurant`  |  アロー関数が書かれた場所のスコープ（グローバル）の this を使う → restaurant ではない  |

日常に置き換えると：

- function = 「制服を着た店員」。どのレストランで働いても、今いる店の名前を名乗る
- アロー関数 = 「自分の名前しか言わない人」。どの店に配属されても、**生まれたときの名前（環境）**しか知らない

もう一つの例：ボタンのクリック（イベントハンドラ）

```js
const button = {
  label: "送信ボタン",

  // 通常の function → this はクリックされた要素を指す
  setupNormal: function () {
    document.getElementById("btn").addEventListener("click", function () {
      console.log(this); // → <button> 要素そのもの（HTMLの要素）
    });
  },

  // アロー関数 → this は書かれた場所（setupArrow の this）を引き継ぐ
  setupArrow: function () {
    document.getElementById("btn").addEventListener("click", () => {
      console.log(this); // → button オブジェクト { label: "送信ボタン", ... }
    });
  },
};
```

```js
button.addEventListener('click', function() {
  console.log(this); // → クリックされたbutton要素
});

button.addEventListener('click', () => {
  console.log(this); // → button要素ではない（外側のthis）
});

// ただし、this の代わりに event.target を使えば同じことができるので、実務でもアロー関数が一般的です。
button.addEventListener('click', (event) => {
  console.log(event.target); // → クリックされたbutton要素
 });
```

まとめ：一言で言うと

通常の function → 「誰が呼んだか」で this が変わる（動的）

アロー関数 → 「どこに書かれたか」で this が固定される（静的）

だからオブジェクトのメソッド（restaurant.greet のような場面）では function を使うべきで、アロー関数で単純に置き換えると this が意図したものにならず壊れることがあります。

逆に、コールバックの中で外側の this をそのまま使いたいとき（2つ目の例の setupArrow）はアロー関数が便利です。

## 参照

- [アロー関数式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [function 式](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/function)