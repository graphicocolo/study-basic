# JavaScript 要素の作成、追加、削除

## 作成

```js
document.createElement('タグ名')
```
作成しただけではブラウザには表示されず、要素を追加する必要がある

## 追加

```js
const elementParent = document.body;
const element = document.createElement('div');
element.textContent = 'abc';
elementParent.append(element); // 末尾に追加
elementParent.prepend(element); // 先頭に追加
```

## 削除

```js
element.remove();
```

- [ドキュメントオブジェクトモデル (DOM)](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model)
- [Element](https://developer.mozilla.org/ja/docs/Web/API/Element)
- [Node](https://developer.mozilla.org/ja/docs/Web/API/Node)