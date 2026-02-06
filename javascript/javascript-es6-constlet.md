# JavaScript ES6（ES2015） const, let

- const
- let
- 再代入禁止とは
- const と let の使い分け基準
- 番外編：var
- 番外編：巻き上げ
- 補足
- 参照

## const

const は再代入禁止のローカル変数（定数）を宣言。ブロックスコープ

[const](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/const)

```js
// 初期値は必要
// const variable1; // SyntaxError: Missing initializer in const declaration
const variable1 = '値を代入'; // 値を代入
// variable1 = '値を再度代入'; // TypeError: Attempted to assign to readonly property. とか TypeError: Assignment to constant variable. とか

// 配列やオブジェクトにも作用

// 配列
const myArray1 = [];
// myArray1 = ["value1"]; // TypeError: Assignment to constant variable.
myArray1.push("othervalue2"); // [ 'othervalue2' ]

// オブジェクト
const myObject1 = { key: "value1" };
// myObject1 = { otherkey: "othervalue1" }; // TypeError: Assignment to constant variable.
myObject1.key = "otherChangeValue"; // { key: 'otherChangeValue' }
```

## let

let は再代入可能なローカル変数を宣言。ブロックスコープ

[let](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let)

```js
let myVariable1; // undefined
let myVariable2 = '値を代入';
myVariable2 = '値を再度代入'; // 値を再度代入
```

## 再代入禁止とは

その変数への代入演算子（=）の使用の禁止、ということ

```js
const x = 10;
x = 20; // error!
```

```ts
const [remainingTime, setRemainingTime] = useState(workDuration); 
```

このコードでは「再代入」は起きていません

理由：

```ts
// 1回目のレンダリング
const [remainingTime, setRemainingTime] = useState(60);
// remainingTime = 60（新しい変数が作られる）

// setRemainingTime(59) を呼ぶ → 再レンダリング発生

// 2回目のレンダリング（関数が最初から再実行される）
const [remainingTime, setRemainingTime] = useState(60);
// remainingTime = 59（また新しい変数が作られる）
```

同じ変数に再代入しているのではなく、**レンダリングごとに新しいスコープで新しい変数が作られている**のです

## const と let の使い分け基準

**ループカウンタや累積値など、明確に再代入が必要な場合だけ let**を使う（ほぼ全ての場合で const を使う）

**実務での方針**

```text
基本は const を使う                                       
  ↓
後で再代入が必要な場合だけ let に変える
  ↓
var は使わない
```

ほとんどのケースで const で書けます。**ループカウンタや累積値など、明確に再代入が必要な場合だけ let**を使います。

```js
// const：この変数に = で代入し直さない
const name = "Alice";
const items = [1, 2, 3];
const age = { age: 20 };

// 中身の変更は再代入ではないのでOK
items.push(4); // 配列の中身を変更
age.key = 22; // オブジェクトのプロパティを変更

items = [5, 6]; // error!
age = { food: "apple" }; // error!
```

```js
// let：後で = で代入し直す必要がある
let count = 0;
count = count + 1;

let result;
if (condition) {
  result = "A";
} else {
  result = "B";
}

// ループ内で使われる変数を let で宣言
for (let i = 0;i < 10; i++) {
  console.log(i);
}
```

## 番外編：var

- 再代入も再宣言も可能
- 再代入だけでなく再定義もできてしまう
- 関数スコープ
- 極力使用しない

## 番外編：巻き上げ

巻き上げとは、JavaScriptがコード実行前に、変数や関数の「宣言部分だけ」をスコープの先頭に移動させる動作

var / let / const いずれも巻き上げは起こるが、var は宣言前のアクセスが undefined になりバグの原因になりやすい。一方 const / let は TDZ（一時的デッドゾーン）により宣言前のアクセスがエラーになるため、早めに気づける。

```js
// 書いたコード
console.log(x);
var x = 10;

// JS が内部的に解釈する形
var x; // ← 宣言だけ先頭へ移動
console.log(x); // undefined
x = 10; // ← 代入はそのまま
```

[Hoisting (巻き上げ、ホイスティング)](https://developer.mozilla.org/ja/docs/Glossary/Hoisting)

### 巻き上げを日常生活の例で考えてみよう

「教室の座席予約」で考えてみよう

学校で新学期に席を決めるとき、こんな状況を想像してください。

---
var の巻き上げ：「とりあえず名札だけ置いておく」方式 

```js
console.log(myName);  // undefined（名前はまだ書いてない）
var myName = "田中";
console.log(myName);  // "田中"

// 日常生活の例：

// 先生「席決めの前に、全員の机に空白の名札を置いておきます」

// 朝、教室に来た生徒「あれ？この席に名札あるけど、名前が書いてない…（undefined）」

// 席決め後「あ、田中さんの席だったのか！」
```

JavaScriptは実行前にコードを「下見」して、var の宣言を見つけると先頭に巻き上げます

```js
// JavaScriptが内部的にこう解釈する
var myName; // 宣言だけ先頭へ（中身は undefined）
console.log(myName); // undefined
myName = "田中"; // ここで初めて値が入る
console.log(myName); // "田中"
```

---

let / const の巻き上げ：「席は決まってるけど、まだ座っちゃダメ」方式

```js
console.log(myName);  // ❌ エラー！（ReferenceError）
let myName = "田中";

// 日常生活の例：

// 先生「席は決めたけど、私が『座っていいよ』と言うまで誰も座らないで」

// 生徒「田中さんの席どこ？」
  
// 先生「まだ言っちゃダメ！（エラー）」
                                                           
// 先生「はい、座っていいよ」（宣言の行に到達）

// 生徒「田中さんは3列目の席だね」（ここで初めてアクセス可能）
```

この「座っちゃダメ」な期間を TDZ（Temporal Dead Zone：一時的デッドゾーン） と呼びます

---

|  特徴  |  var  |  let  |  const  |
| ---- | ---- | ---- | ---- |
|  巻き上げ  |  される  |  される  |  される  |
|  宣言前にアクセス  |  undefined  |  エラー  |  エラー  |
|  日常例  |  空の名札が置いてある  |  席はあるけど座れない  |  席はあるけど座れない  |

---

もう一つの例：「お弁当の予約」

```js
// var：予約表に名前だけ先に書いてある
console.log(varBento);    // undefined（予約はあるけど中身未定）
var varBento = "からあげ弁当";
// var の場合：
// お弁当屋さん「予約表には田中さんの名前あるけど、何弁当かはまだ書いてないね（undefined）」

// let：予約受付開始前
console.log(letBento);    // ❌ エラー（まだ予約できません！）
let letBento = "からあげ弁当";

// const：予約受付開始前
console.log(constBento);  // ❌ エラー（まだ予約できません！）
const constBento = "からあげ弁当";

// let / const の場合：
// お弁当屋さん「予約受付は10時からです。それまでは予約表を見せられません！（エラー）」
```

---

なぜ let / const の方が安全か

```js
// var だと気づかないバグが起きやすい
console.log(score); // undefined（エラーにならない！）
// ...100行のコード...
var score = 100;

// let だとすぐエラーで教えてくれる
console.log(score);  // ❌ ReferenceError！
let score = 100;
```

let / const は「間違ってるよ！」とすぐ教えてくれる親切なエラーを出してくれます。

---

巻き上げで困るケースをコードで見てみる

ケース1：タイプミスに気づけない

```js
var userName = "田中";
// ...50行くらいのコード...
// タイプミス（userNameのつもりがuserNaem）
console.log(userNaem);
// var: undefined（エラーにならず、バグに気づかない）
// let: ❌ ReferenceError（すぐ気づける）

// var だと「なぜか表示されない…」と悩み、const だと即座に「その変数ないよ」と教えてくれます。
```

ケース2：for ループのよくあるバグ

```js
// ボタンを3つ作って、クリックしたら番号を表示したい
var buttons = [];

for (var i = 0; i < 3; i++) {
  buttons[i] = function() {
    console.log("ボタン" + i + "がクリックされた");
  };
}

buttons[0]();  // "ボタン3がクリックされた"  ← 0じゃない！
buttons[1]();  // "ボタン3がクリックされた"  ← 1じゃない！
buttons[2]();  // "ボタン3がクリックされた"  ← 2じゃない！

// なぜ全部3になる？
// var は関数スコープなので、ループが終わった後の i = 3 を全員が見てしまう。

// let なら期待通りに動く
for (let i = 0; i < 3; i++) {
  buttons[i] = function() {
    console.log("ボタン" + i + "がクリックされた");
  };
}

buttons[0]();  // "ボタン0がクリックされた"
buttons[1]();  // "ボタン1がクリックされた"
buttons[2]();  // "ボタン2がクリックされた"

// let はブロックスコープなので、ループごとに別の i が作られます。
```

ケース3：if文の中で宣言したつもりが漏れる

```js
function checkAge(age) {
  if (age >= 20) {
    var message = "お酒が買えます";
  }
  console.log(message);
} // var は if ブロックを無視して関数全体に存在してしまう

checkAge(25);  // "お酒が買えます"
checkAge(15);  // undefined（エラーにならない！）
```

```js
function checkAge(age) {
  if (age >= 20) {
    let message = "お酒が買えます";
  }
  console.log(message); // ❌ ReferenceError
} //   let なら「messageって何？」とエラーで教えてくれます
```

---

なぜ `undefined` が問題か

|  状況  |  var  |  let/const  |
| ---- | ---- | ---- |
|  タイプミス  |  黙って undefined  |  即エラー  |
|  ループのバグ  |  全部同じ値を参照  |  各ループで独立  |
|  ブロック外参照  |  漏れる  |  エラー  |
|  再宣言  |  黙って上書き  |  エラー  |

「エラーにならない」は「バグに気づけない」と同じです。

小さなコードでは問題になりにくいですが、コードが大きくなると「なぜか動かない」の原因調査に時間を取られます。let / const は「ここ間違ってるよ」と即座に教えてくれるので、結果的に開発が早くなります。

---

だから現代のJavaScriptでは const と let を使い、var は使わないのがベストです。

## 補足

- JavaScipt では、変数はその値を直接扱うわけではなく、メモリ上の値を参照している
- 変数名には、アルファベット、数字、_、ドルマークが使える
- 数字から始めて命名することはできない
- 大文字小文字は区別される
- 変数名に複数単語使用時はキャメルケースを使うことが多い
 - ローワーキャメルケース (lowerCamelCase)
 - アッパーキャメルケース (UpperCamelCase/PascalCase)
- var、let、const をつけずに変数を利用するとグローバル変数になってしまう
- 予約語は変数名として使えない<br>
[予約語](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Lexical_grammar#%E3%82%AD%E3%83%BC%E3%83%AF%E3%83%BC%E3%83%89)

## 参照

- [変数と宣言](https://jsprimer.net/basic/variables/)
- [変数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#%E5%A4%89%E6%95%B0)