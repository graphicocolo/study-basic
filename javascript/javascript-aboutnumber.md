# JavaScript 数値の扱い

## `Math.floor` と `Math.trunc`

`Math.floor` が多く使われる理由

主に習慣と歴史です。Math.floor はJavaScript初期（ES1）から存在し、Math.trunc はES6（2015年）で追加されました。多くの入門書やチュートリアルが Math.floor で書かれているため、そのまま広まっています。

**2つの違い**

負の数のときだけ結果が異なります。正の数では結果は完全に同じです。

```js
Math.floor(-7 / 2)  // -4（負の無限大方向に切り捨て）
Math.trunc(-7 / 2)  // -3（ゼロ方向に切り捨て＝小数部を取り除く）
```

- [Math.floor()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
- [Math.trunc()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)