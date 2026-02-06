# JavaScript ES6（ES2015） テンプレートリテラル(テンプレート文字列)

- 

バッククオートで区切られたリテラル。ES2015 から導入された。

テンプレートリテラル内では変数が展開されるため、文字列と変数を合わせて記述したい場合簡潔に記述できる。

```js
const calcResult = 1 + 2;
const double = 2;
console.log(`計算結果は${calcResult}です`);
console.log(`計算結果の${double}倍の値は${calcResult * double}です`);
```

## 参照

- [テンプレートリテラル (テンプレート文字列)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals)