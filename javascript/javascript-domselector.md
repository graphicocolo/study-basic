# JavaScript DOM とセレクター

## DOM

[ドキュメントオブジェクトモデル (DOM)](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model)

HTMLをブラウザが解釈して作った、JavaScriptで操作できるオブジェクトの集合体。

### HTMLとDOMの違い

- HTMLタグ → ただのテキスト（ソースコード上の文字列）
- DOM → ブラウザがそのタグを解釈して作ったオブジェクト

| | 説明 |
|---|---|
| **HTML** | テキストで書かれたマークアップ（ソースコード） |
| **DOM** | ブラウザがHTMLを読み込んで作る、プログラムから操作可能なオブジェクトの木構造 |

### DOMツリーのイメージ

```html
<html>
  <body>
    <h1>タイトル</h1>
    <p>本文</p>
  </body>
</html>
```

上記のHTMLをブラウザが **DOMツリー** に変換する：

```
document
  └── html
        └── body
              ├── h1 ("タイトル")
              └── p ("本文")
```

各パーツ（`h1`や`p`など）を **ノード** と呼ぶ。
DOMがあるからこそ `document.querySelector('h1')` のようにJavaScriptからHTMLの要素を取得・変更できる。

例えば <h1>タイトル</h1> というHTMLタグを、ブラウザが読み込むと、プロパティやメソッドを持つ DOMオブジェクト になります。

```text
HTMLタグ（テキスト） →  ブラウザが解釈  →  DOMオブジェクト
 <h1>タイトル</h1> 

h1要素ノード
├── .textContent = "タイトル"
├── .style
├── .classList
└── .addEventListener() など
```

だからこそJavaScriptで .textContent を変えたり、.style を操作したりできるわけです。タグのままではただの文字列なので、プログラムから操作できません。

```text
1. HTMLを書く（ソースコード）
↓
2. ブラウザが読み込んでDOMを生成（オブジェクトのツリー構造）
↓
3. JavaScriptでDOMを操作する（取得・変更・追加・削除など）
↓
4. 画面に反映される
```

ポイントは、JavaScriptはHTMLファイルを直接書き換えているわけではないということです。あくまでブラウザが作ったDOM（メモリ上のオブジェクト）を操作していて、それが画面に即座に反映される仕組みです。

なのでJavaScriptで要素を変更しても、HTMLのソースファイル自体は変わりません。ページをリロードすれば元に戻ります。

## セレクター

[CSS セレクター](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Selectors)

DOMの中から特定の要素を指定・取得するための記法です。

CSSで `h1 { color: red; }` と書くときの `h1` がセレクターですが、JavaScriptでも同じ記法を使ってDOM要素を取得できます。

```js
// CSSセレクターを使ってDOM要素を取得する
document.querySelector('h1')        // タグ名で指定
document.querySelector('.class名')  // クラス名で指定
document.querySelector('#id名')     // ID名で指定
```

つまり、CSSで使っているセレクターをそのままJavaScriptでも使える、ということです。

### コード例

```js
// 該当する単一の要素を選択
// 戻り値は一つの要素

const value = document.querySelector('#price').value;
console.log(value);

const element = document.querySelector('#price');
console.log(element.value);
```

```js
// 該当する複数の要素を選択
// 戻り値は NodeList

const elements = document.querySelectorAll('.item');
const array = Array.from(elements); // 配列化
```

```html
<ul id="list-animal">
  <li class="animal">dog</li>
  <li class="animal">cat</li>
  <li class="animal">bird</li>
</ul>
<input type="text" value="dog">
```

```js
document.querySelector('ul');
document.querySelector('#list-animal');
document.querySelectorAll('.animal');
document.querySelector('[type="text"]');
```

**値の読み書き**

|  プロパティ  |  読み書きできる値  |
| ---- | ---- |
|  要素.outerHTML  |  自身を含むHTMLの文字列  |
|  要素.innerHTML  |  内部HTMLの文字列  |
|  要素.textContent  |  内部テキストの文字列<br>（タグ以外の文字列）  |
|  要素.value  |  フォームの値の文字列  |
|  要素.属性名  |  属性の値の文字列  |

`innerHTML()` と `textContent`

`innerHTML()` にユーザーの入力値をそのまま入れると危険

```js
// ユーザーが悪意のある入力をした場合
const userInput = '<img src=x onerror="alert(\'攻撃\')">';
el.innerHTML = userInput;   // → スクリプトが実行されてしまう
el.textContent = userInput; // → 文字としてそのまま表示される（安全）