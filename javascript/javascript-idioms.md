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
- 関数の実行と関数の参照
- ガード節（Guard Clause）
- Result型パターン

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

## 関数の実行と関数の参照

`()` の有無で意味が変わる。

```js
validateUsername();  // 今すぐ実行して、結果（true/false）を返す
validateUsername     // 「この関数」という参照（まだ実行しない）
```

### addEventListener での使い分け

`addEventListener` の第2引数は「イベントが起きたときに呼び出す関数」を渡す場所。

```js
// NG：() あり → addEventListener に渡す前に今すぐ実行してしまう
// blur が起きたときではなく、この行を読んだ瞬間に実行される
input.addEventListener("blur", validateUsername());

// OK：() なし → 関数の参照を渡す
// blur が起きたタイミングで、ブラウザが validateUsername() を呼び出してくれる
input.addEventListener("blur", validateUsername);
```

`() => validateUsername()` も同じ理由で動く。「blur が起きたら validateUsername() を実行する関数」を渡しているので、即実行にはならない。ただし引数なしの関数であれば直接参照を渡す方が簡潔。

### たとえ

```
「今すぐ電話して」      → validateUsername()  // 実行
「何かあったら電話して」 → validateUsername    // 参照（必要なときに呼ばれる）
```

`()` は「実行する」という命令記号というイメージ

---

## ガード節（Guard Clause）

「条件を満たさなければ早期リターン」するパターン。ネストを深くせずに異常系を先に弾く。

```js
// ガード節なし（ネストが深くなる）
function validateUsername() {
  if (usernameInput.value.trim() !== "") {
    if (usernameInput.value.length >= 3) {
      usernameError.textContent = "";
      return true;
    } else {
      usernameError.textContent = "3文字以上で入力してください";
      return false;
    }
  } else {
    usernameError.textContent = "ユーザー名を入力してください";
    return false;
  }
}

// ガード節あり（異常系を先に弾いて早期リターン）
function validateUsername() {
  if (!validateNotEmpty(usernameInput, "ユーザー名", usernameError)) return false;
  if (usernameInput.value.length < 3) {
    usernameError.textContent = "3文字以上で入力してください";
    return false;
  }
  usernameError.textContent = "";
  return true;
}
```

読み方：「NGなら、ここで終了」という1行の宣言として読む。

**出典：** `study-archive/javascript/practice/formValidation.js`（フォームバリデーション課題）

---

## Result型パターン

```ts
// 入力値検証、数値変換を行う関数
// 各種バリデーションと数値変換をここ1箇所で行う
function validateInputToInteger(value: string, max: number): { value: number } | { error: string } {
  if (value.trim() === '') return { error: '値を入力してください' }
  const num = Number(value)
  if (Number.isNaN(num)) return { error: '有効な数値を入力してください' }
  if (num < 1) return { error: '1以上の数値を入力してください' }
  if (num > max) return { error: `${max}以下の数値を入力してください` }
  return { value: Math.floor(num) }
}

export function useBmiCalculator() {
  // 入力値を検証し、エラーを設定する関数
  const validateAndSetError = (value: string, max: number) => {
    const result = validateInputToInteger(value, max)
    if ('error' in result) {
      setError(result.error)
      setBmi('ー')
    } else {
      setError(null)
    }
  }
}
```

一方、ハンドラーの中でエラーを返すパターン

```ts
// バリデーションのみ、真偽を返す
// 空文字バリデーション
function validateNotEmpty(value:string) {
  if (value.trim() === '') {
    return false;
  }
  return true;
}

// バリデーションのみ、真偽を返す
// 入力値バリデーション
function validateScoreRange(value: string) {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
    return false;
  }
  return true;
}

export function useScoreSort() {
  const handleBlur = (subject: string) => {
    setScores(prev =>
      prev.map(score => {
        if (score.subject !== subject) return score
        if (!validateNotEmpty(score.value)) return {...score, error: `${score.subject}の点数が空です`}
        if (!validateScoreRange(score.value)) return {...score, error: '0以上100以下の数字を入力してください'}
        return {...score, error: ''}
      })
    )
  }
}
```

### 2パターンの比較

| | Result型（useBmiCalculator） | true/false型（useScoreSort） |
|---|---|---|
| バリデーション関数の返り値 | `{ value: number } \| { error: string }` | `true / false` |
| エラーメッセージの管理場所 | 関数の中 | ハンドラ側で書く |
| 呼び出し側の書き方 | `'error' in result` で分岐 | `!validate()` で分岐 |

- **Result型**：エラー文字列の管理が一箇所にまとまる。検証と変換をセットで扱いたいときに向く
- **true/false型**：シンプルで読みやすい。エラーメッセージを呼び出し側でコントロールしたいときに向く

どちらも正解。「バリデーション関数が複数の責務を持つ＝悪い設計」ではなく、**切り離せない処理をまとめているなら一つの関数でよい**。

**出典：** `study-app/react-practice/src/hooks/useBmiCalculator.ts` / `useScoreSort.ts`

---

## オブジェクトマップ

キーと値のペアを持つオブジェクトを使って、**switch文の代わりに値を引き出す**テクニック。

```tsx
// switch で書くと…
switch (showElement) {
  case 'TaxCalculator':   return <TaxCalculator />
  case 'BmiCalculator':   return <BmiCalculator />
  case 'SplitCalculator': return <SplitCalculator />
}

// オブジェクトマップで書くと…
const MAP = {
  TaxCalculator:   <TaxCalculator />,
  BmiCalculator:   <BmiCalculator />,
  SplitCalculator: <SplitCalculator />,
}

MAP[showElement]  // showElement の値でオブジェクトを検索して取り出す
```

辞書で単語を引くように、**キーで値を一発検索できる**のがポイント。

### switch文との比較

| | switch文 | オブジェクトマップ |
|---|---|---|
| JSX内で使える | ❌（即時関数が必要） | ✅ |
| コードの長さ | 長め | 短め |
| 発想 | 条件分岐（上から順に比較） | 辞書引き（キーで直接取り出す） |

### JSX内で switch が使えない理由

JSX の `{ }` 内に書けるのは**式（expression）**のみ。`switch` は**文（statement）**なので構文エラーになる。  
オブジェクトマップは `MAP[key]` という式なので JSX 内に直接書ける。

**出典：** `study-app/react-practice/src/App.tsx`（成績ソートアプリ）

---
