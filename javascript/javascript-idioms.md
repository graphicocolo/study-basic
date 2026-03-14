# JavaScript イディオム集

> イディオム：「こういう目的にはこう書く」と広く使われている定番のコードパターン。

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
- `||` との違い：`0` や `''`（空文字）は有効な値として扱う

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

## 条件が真のときだけ表示する（`&&` による条件付きレンダリング）

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
