# JavaScript クラスの操作

`element.className` で `class` 属性にアクセスできる

`element.classList` で操作すると良い

```js
element.classList.add('panel'); // 追加
element.classList.remove('panel'); // 削除
element.classList.toggle('panel'); // 切り替え 一度追加するたびに要素にクラスを追加したり削除したりすることができる
```

- [Element: classList プロパティ](https://developer.mozilla.org/ja/docs/Web/API/Element/classList)
- [DOMTokenList](https://developer.mozilla.org/ja/docs/Web/API/DOMTokenList)

## スタイルの操作

```js
// <div style="background: #fff;">なら以下のように代入
element.style.background = "#fff";

// <div style="font-size: 2rem;">なら以下のように代入
element.style.fontSize = "2rem";
```