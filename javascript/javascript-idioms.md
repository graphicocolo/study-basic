# JavaScript イディオム集

> イディオム：「こういう目的にはこう書く」と広く使われている定番のコードパターン。

---

- 値を MIN〜MAX の範囲に収める（clamp）
- オブジェクトの一部だけ変えてコピーする
- 数値変換できなければ 0 にする
- null/undefined チェックしながら関数を呼ぶ（オプショナルチェーン呼び出し）
- null/undefined のときだけデフォルト値を使う（`??`）
- 2択の値を1行で書く（三項演算子）
- 条件が真のときだけ表示する（`&&` による条件付きレンダリング）
- 文字列を逆にする
- 文字列→数値
- 配列内の数値の要素を昇順に並べ替え

---

## 値を MIN〜MAX の範囲に収める（clamp）

```ts
Math.min(Math.max(value, MIN), MAX)
```

- `Math.max(value, MIN)`：下限を守る（MIN より小さければ MIN にする）
- `Math.min(..., MAX)`：上限を守る（MAX より大きければ MAX にする）

**if 文で書くと同じ意味：**

```ts
if (value < MIN) return MIN
if (value > MAX) return MAX
return value
```

**出典：** `components/settings/TimeSettings.tsx`（ポモドーロタイマー）

---

## オブジェクトの一部だけ変えてコピーする

```ts
{ ...obj, key: newValue }
```

- `...obj` で元のオブジェクトの全プロパティをコピー
- その後に書いたプロパティで上書きする

**例：**

```ts
const value = { minutes: 20, seconds: 30 }

// minutes だけ変えたい
const updated = { ...value, minutes: 25 }
// → { minutes: 25, seconds: 30 }
```

**出典：** `components/settings/TimeSettings.tsx`（ポモドーロタイマー）

---

## 数値変換できなければ 0 にする

```ts
parseInt(str, 10) || 0
```

- `parseInt` が `NaN` を返したとき、`NaN || 0` で 0 にフォールバックする
- 空欄や不正な入力への対策としてよく使われる

**出典：** `components/settings/TimeSettings.tsx`（ポモドーロタイマー）

---

## null/undefined チェックしながら関数を呼ぶ（オプショナルチェーン呼び出し）

```ts
ref.current?.()
```

- `?.` が null/undefined のとき、関数を呼ばずにスキップする
- エラーを防ぎながら「あれば実行」を1行で書ける

**if 文で書くと同じ意味：**

```ts
if (ref.current !== null && ref.current !== undefined) {
  ref.current()
}
```

**出典：** `hooks/useTimer.ts`（ポモドーロタイマー）

---

## null/undefined のときだけデフォルト値を使う（`??`）

```ts
getSavedTheme() ?? getSystemTheme()
```

- 左辺が `null` または `undefined` のときだけ右辺を返す
- 論理和 `||` との違い：`0` や `''`（空文字）は有効な値として扱う

**`||` との比較：**

```ts
0 || 'default'   // → 'default'  （0 は falsy なので右辺になる）
0 ?? 'default'   // → 0          （0 は null/undefined ではないのでそのまま）
```

**出典：** `hooks/useTheme.ts`（ポモドーロタイマー）

---

## 2択の値を1行で書く（三項演算子）

```ts
condition ? valueA : valueB
```

- 条件が真なら `valueA`、偽なら `valueB`
- if 文より短く書けるが、複雑な条件には使わない

**例：**

```ts
phase === 'work' ? 'text-work' : 'text-break'
// phase が 'work' なら 'text-work'、それ以外は 'text-break'
```

**出典：** `components/timer/TimerDisplay.tsx`（ポモドーロタイマー）

---

## 条件が真のときだけ表示する（論理積 `&&` による条件付きレンダリング）

```tsx
{condition && <Component />}
```

- `condition` が真のときだけ `<Component />` が描画される
- 偽のときは何も描画されない

**例：**

```tsx
{isMuted && <VolumeX />}
// isMuted が true のときだけアイコンを表示
```

**`condition` が数値のときの注意：**

```tsx
{count && <List />}
// count が 0 のとき、false ではなく 0 が描画されてしまう
// → {count > 0 && <List />} と書くのが安全
```

**出典：** `components/settings/SettingsPanel.tsx`（ポモドーロタイマー）

---

## 文字列を逆にする

```js
"hello".split("").reverse().join(""); // "olleh"
```

---

## 文字列→数値

```js
"1,2,3".split(",").map(Number); // [1, 2, 3]  文字列→数値
```

---

## 配列内の数値の要素を昇順に並べ替え

```js
const arr = [1024, 365, 12, 9]
arr.sort((a, b) => {
  return a - b
})
console.log(arr) // [9, 12, 365, 1024]
```

---

## 配列の要素を並び替え（ドラッグドロップで UI を並べ替える時などに使用）

spliceは破壊的だからReactではコピーしてから使う

```js
  const reorderTodos = useCallback((activeId, overId) => {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((todo) => todo.id === activeId); // 並べ替え対象となる TODO の index
      const newIndex = prev.findIndex((todo) => todo.id === overId); // 順番変更対象となる TODO の index

      if (oldIndex === -1 || newIndex === -1) return prev; // 該当する要素がなかった場合は現在の状態を返す

      const newTodos = [...prev]; // 配列をコピー
      const [removed] = newTodos.splice(oldIndex, 1); // splice で並べ替え対象を抜き取る
      // newTodos = [ A, B, C, D ] とすると...
      // splice(1, 1) → index1から1個取り出す
      // removed = B
      // const [removed] = の [] は分割代入。splice は取り出した要素を配列で返すので、その最初の1個を取り出している。
      // newTodos = [ A, C, D ]  ← B が抜けた
      newTodos.splice(newIndex, 0, removed); // 抜き取った B を newIndex の位置に差し込む
      // splice(3, 0, B) → index3の位置に、0個削除して、Bを挿入
      // newTodos = [ A, C, D, B ]
      // before: [ A, B, C, D ] after:  [ A, C, D, B ]
      // Bが末尾に移動した。配列の順番が変わったので、画面の表示順も変わる。

      return newTodos;
    });
  }, []);
```

---

## React での定番操作パターン

React では元のデータを直接変えず、新しいデータを作って差し替えるのが基本。

| やりたいこと | Reactでの定番 | 理由 |
|---|---|---|
| 要素を削除 | `filter()` で除外した新しい配列を返す | 非破壊的 |
| 要素を移動 | コピーしてから `splice` × 2回 | splice は破壊的なのでコピーが必須 |
| 要素を更新 | `map()` で新しいオブジェクトに差し替え | 非破壊的 |

**出典：** `hooks/useTodos.js`（Todo アプリ）

---
