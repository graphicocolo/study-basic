# JavaScript DOM, Node, Element

## DOM（Document Object Model）

HTMLをJavaScriptから操作するための**仕組み全体**のことです。HTMLをツリー構造として扱うための設計図のようなものです。「DOMを操作する」と言うときは、この仕組みを通じてHTMLを読み書きすることを指します。

## Node（ノード）

DOMツリーを構成する**すべてのパーツの総称**です。

```html
<p>こんにちは</p>
```

このコードには2つの Node があります。

- `<p>` タグ → **要素ノード**
- `こんにちは` というテキスト → **テキストノード**

コメント（`<!-- ... -->`）もノードです。

## Element（エレメント）

Node の中でも**タグで囲まれた要素だけ**を指します。つまり Element は Node の一種です。

```
Node（全体）
├── Element（タグ）  ← <p>, <div>, <input> など
├── テキストノード   ← 文字列
└── コメントノード  ← <!-- -->
```

## まとめ

| | 一言 |
|--|------|
| DOM | HTMLをJSで操作する仕組み全体 |
| Node | DOMツリーのすべてのパーツ |
| Element | Node のうち、タグの部分だけ |

**Element は必ず Node だが、Node は必ずしも Element ではない**、という関係です。

## 参照

- [ドキュメントオブジェクトモデル (DOM)](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model)
- [Element](https://developer.mozilla.org/ja/docs/Web/API/Element)
- [Node](https://developer.mozilla.org/ja/docs/Web/API/Node)