# JavaScript イディオム集

> イディオム：「こういう目的にはこう書く」と広く使われている定番のコードパターン。

---

- 値を MIN〜MAX の範囲に収める（clamp）
- 限られた整数値をランダムに算出
- オブジェクトの一部だけ変えてコピーする
- 数値変換できなければ 0 にする
- null/undefined チェックしながら関数を呼ぶ（オプショナルチェーン呼び出し）
- null/undefined のときだけデフォルト値を使う（`??`）
- 2択の値を1行で書く（三項演算子）
- 条件が真のときだけ表示する（`&&` による条件付きレンダリング）
- 文字列を逆にする
- 文字列→数値
- 配列内の数値の要素を昇順に並べ替え
- 文字列 → 配列、配列 → 文字列の変換
- 配列の値を一つにまとめる
  - 配列の要素の合計値を求める
  - 配列の要素の最大値を求める
- 配列の数値の重複を削除する
- 指定した数の入った配列を作成
- 関数の実行と関数の参照
- 関数を返す関数
- ガード節（Guard Clause）
- Result型パターン
- オブジェクトマップ
- 分割代入・スプレッド構文・レスト構文
- ボタンを押したら送信、でも連打防止
- `disabled` ボタンの状態管理
- 一定時間操作がなければ自動ログアウト
- リアルタイム時計（ストップウォッチにも応用できる）
- ストップウォッチの時刻文字表示揺れ対応（ミリ秒表示で画面文字が揺れる）
- デバウンス（検索ボックスでよく使う）
- セッションストレージを利用して特定条件下で要素を非表示
- 日付と時刻関連
- データ駆動バリデーション（ルールを配列で管理する）
- DOM 操作
  - ボタンをクリックすると、対応するコンテンツだけが表示されるタブUI
  - モーダル(開くボタンと閉じるボタンあり、背景クリックでも閉じる)

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

## 限られた整数値をランダムに算出

```js
// 1, 2 がランダムに算出
// かける数 = 出したい整数の最大値
// 0 は出る確率がほぼ0%なので実質 1, 2 がランダムに算出される
const limitedInteger1 = Math.ceil(2 * Math.random());

// 0, 1 がランダムに算出
// かける数 = 出るパターンの個数、0〜(かける数-1) の範囲が出る
const limitedInteger2 = Math.floor(2 * Math.random());
```

`Math.ceil(2 * Math.random())` について

**`Math.random()`**

`0` 以上 `1` 未満の小数をランダムに返す。
例：`0.0`, `0.312...`, `0.999...` など（`1` は含まれない）

**`2 * Math.random()`**

`0` 以上 `2` 未満の小数になる。
例：`0.0`, `0.624...`, `1.998...` など

Math.random() は `[0, 1]` までしか出ません。そのままでは 1 以上の数が出ないため、2 をかけて `[0, 2]` の範囲に引き伸ばしています。

- Math.random()     →  [0, 1)  →  Math.ceil すると 0 or 1
- 2 * Math.random() →  [0, 2)  →  Math.ceil すると 0 or 1 or 2
- 3 * Math.random() →  [0, 3)  →  Math.ceil すると 0 or 1 or 2 or 3

かける数 = 出したい整数の最大値というイメージです。

**`Math.ceil(...)`**

小数を**切り上げ**て整数にする。「その数以上の最小の整数」を返す。
例：`Math.ceil(0.1)` → `1`、`Math.ceil(1.9)` → `2`、`Math.ceil(0)` → `0`

0 → 0 以上の整数で一番小さいのは 0 → 0（ぴったり整数のときだけ変わらない）

実際に出る値：

| `2 * Math.random()` の範囲 | `Math.ceil` の結果 |
|---|---|
| ちょうど `0`（確率ほぼ0） | `0` |
| `(0, 1]` | `1` |
| `(1, 2)` | `2` |

`Math.random()` がちょうど `0` を返す確率は理論上ゼロに近いため、実質的に `1` か `2` しか出ない。`0` はほぼ生成されない。

**0〜2の範囲とするには `Math.floor` を使う：**

```js
// 0, 1, 2 をそれぞれ約1/3の確率で生成する
let bnNum = Math.floor(3 * Math.random());
```

`Math.random()` が `[0, 3)` になり、`Math.floor`（切り捨て）で `0`, `1`, `2` が均等に出る。

### `Math.ceil(2 * Math.random())` と `Math.floor(2 * Math.random())` の使い分け

`Math.floor()` は切り捨て、`Math.ceil()` は切り上げ

| | 出る値（×2の場合） | 開始 |
|---|---|---|
| `Math.ceil` | 1, 2 | 1始まり |
| `Math.floor` | 0, 1 | 0始まり |

**`Math.ceil` が向くケース：1始まりの番号が必要なとき**

CSSクラス名や人間が読む番号など、0を使いたくない場面。

```js
// background1, background2 を出したい → Math.ceil が自然
const bnNum = Math.ceil(2 * Math.random());
element.classList.add(`background${bnNum}`); // background0 は出ない

// サイコロ（1〜6）
const dice = Math.ceil(6 * Math.random()); // 1, 2, 3, 4, 5, 6
```

**`Math.floor` が向くケース：0始まりのインデックスが必要なとき**

配列のインデックス参照など、プログラム的に0から始まる場面。

```js
// 配列のランダムな要素を取り出す → Math.floor が自然
const items = ['りんご', 'みかん', 'ぶどう'];
const item = items[Math.floor(items.length * Math.random())];
// items[0], items[1], items[2] → 3つすべてに均等にアクセスできる
```

- **表示・見た目に関わる番号（CSSクラス、ラベルなど）** → `Math.ceil`（1始まり）
- **配列のインデックスなどプログラム内部の処理** → `Math.floor`（0始まり）

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
// sort() は破壊的であることに注意
const sortedArr = [...arr].sort((a, b) => {
  return a - b // 昇順にソート
})
console.log(sortedArr) // [9, 12, 365, 1024]
```

---

## 文字列 → 配列、配列 → 文字列の変換

```txt
文字列.split(区切り文字) → 配列
配列.join(区切り文字) → 文字列
```

---

## 配列の値を一つにまとめる

### 配列の要素の合計値を求める

```ts
type ArrayDatas<T> = Array<T>;
const numbers: ArrayDatas<number> = [1, 2, 3, 4, 5];

function addNumbersWithForOf (numbers: ArrayDatas<number>): number {
  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }
  return sum;
}
console.log(addNumbersWithForOf(numbers));

function addNumbersWithForEach (numbers: ArrayDatas<number>): number {
  let result = 0;
  numbers.forEach((n) => {
    result += n;
  });
  return result;
}
console.log(addNumbersWithForEach(numbers));

// reduce 配列を1つの値にまとめる処理（合計・最大など）
// acc → 累積値 num → 今の要素
// acc + num の結果が次の回の acc として引き継がれていきます。最終的に返ってきた 15 が sum に入ります。
function addNumbersWithReduce (numbers: ArrayDatas<number>): number {
  let sum: number = numbers.reduce((acc, n) => acc + n, 0);
  return sum;
}
console.log(addNumbersWithReduce(numbers));
```

### 配列の要素の最大値を求める

```ts
type ArrayDatas<T> = Array<T>;
const numbers: ArrayDatas<number> = [1, 2, 3, 4, 5];

//  -Infinity … 負の無限大（Number.NEGATIVE_INFINITY）
//  Infinity … 正の無限大（Number.POSITIVE_INFINITY）
function getNumberWithReduce (numbers: ArrayDatas<number>): number {
  // let result = numbers.reduce((a, b) => a > b ? a : b); // これでもOK
  let result = numbers.reduce((a, b) => Math.max(a, b), -Infinity); // 初期値を0にすると配列に負数がある場合に正しい最大値が返らない
  return result;
}
console.log(getNumberWithReduce(numbers));
```

---

## 配列の数値の重複を削除する

```ts
const duplicatedNumbers: ArrayDatas<number> = [1, 2, 2, 3, 4, 4, 5]

function deleteDuplicationItemInArrayWithSet (numbers: ArrayDatas<number>): ArrayDatas<number> {
  return [...new Set(numbers)]
}
console.log(deleteDuplicationItemInArrayWithSet(duplicatedNumbers))

function deleteDuplicationItemInArrayWithFilter (numbers: ArrayDatas<number>): ArrayDatas<number> {
  return numbers.filter((item, index) => index === numbers.indexOf(item));
}
// indexOf は常に「最初に見つかったインデックス」を返す
// つまり、ある値についてはnumbers.indexOf(item)は普遍のインデックス値
// [10, 20, 20, 30] で考えてみる
// - 1個目の 20（index=1）→ indexOf(20) も 1 → 一致 → 残る
// - 2個目の 20（index=2）→ indexOf(20) は まだ 1 → 不一致 → 捨てられる
// つまり「自分が最初の出現か？」を判定していて、2回目以降の重複は false になって除外される仕組み
console.log(deleteDuplicationItemInArrayWithFilter(duplicatedNumbers));
```

---

## 指定した数の入った配列を作成

```js
// 1〜100 の配列を作る
const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
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

## 関数を返す関数

「設定や文脈を外側の関数で受け取り、それを使う処理を内側の関数として返す」パターン。

返り値の型は `(引数の型) => 返り値の型` という関数の形で書く。

```typescript
// 通常：返り値が値
function greet(name: string): string {
  return "こんにちは " + name;
}

// 関数を返す：返り値が関数
function createGreeter(prefix: string): (name: string) => string {
  return (name) => prefix + name;
}

const hello = createGreeter("こんにちは ");
hello("田中"); // "こんにちは 田中"
```

### ユースケース

共通のパターン：「設定や文脈を外側の関数で受け取り、それを使う処理を内側の関数として返す」という形。「どんなルールか」を外側で受け取り「値を検証する処理」を返している。

**1. 設定を渡して専用の処理関数を作る**

同じ構造の関数を、設定だけ変えて複数作りたいときに使う。

```typescript
function createTaxCalculator(rate: number): (price: number) => number {
  return (price) => price * (1 + rate);
}

const calcJP = createTaxCalculator(0.10);
const calcUS = createTaxCalculator(0.08);

calcJP(1000); // 1100
calcUS(1000); // 1080
```

**2. イベントハンドラーの生成**

ほぼ同じハンドラーを複数書かずに済む。React で頻出。

```typescript
function createChangeHandler(field: string): (e: Event) => void {
  return (e) => {
    console.log(`${field} が変更された`);
  };
}

input.addEventListener("change", createChangeHandler("email"));
input.addEventListener("change", createChangeHandler("username"));
```

**3. デバウンス（入力のたびに処理を走らせない）**

```typescript
function debounce(fn: () => void, delay: number): () => void {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

const search = debounce(() => console.log("検索実行"), 300);
// 連続入力しても最後の入力から300ms後に1回だけ実行される
input.addEventListener("input", search);
```

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

## 分割代入・スプレッド構文・レスト構文

### 分割代入（Destructuring Assignment）

配列やオブジェクトから値を取り出して、変数に一括で代入する。

**配列の分割代入**

```js
const colors = ["red", "green", "blue"];

const [first, second] = colors;
// first  → "red"
// second → "green"
```

**オブジェクトの分割代入**

```js
const user = { name: "Alice", age: 25, role: "admin" };

const { name, age } = user;
// name → "Alice"
// age  → 25
```

**別名をつける**

```js
const { name: userName } = user;
// userName → "Alice"（変数名を name から userName に変更）
```

**デフォルト値を設定する**

```js
const { name, score = 0 } = user;
// score プロパティがなければ 0 になる
```

**関数の引数でも使える**

```js
function greet({ name, age }) {
  console.log(`${name}（${age}歳）`);
}
greet(user); // "Alice（25歳）"
```

---

### スプレッド構文（Spread Syntax）

配列・オブジェクトを「展開」して別の配列・オブジェクトや関数の引数に埋め込む。

**配列の展開**

```js
const a = [1, 2, 3];
const b = [0, ...a, 4];
// b → [0, 1, 2, 3, 4]
```

**配列のコピー（参照を切り離す）**

```js
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
// original → [1, 2, 3]（変わらない）
// copy     → [1, 2, 3, 4]
```

**オブジェクトの展開**

```js
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 };
// extended → { a: 1, b: 2, c: 3 }
```

後から書いたプロパティで上書きされる（`clamp` や `useState` の更新でも使うパターン）。

```js
const updated = { ...base, b: 99 };
// updated → { a: 1, b: 99 }
```

**関数の引数への展開**

```js
const nums = [3, 1, 4];
Math.max(...nums); // → 4（Math.max(3, 1, 4) と同じ）
```

---

### レスト構文（Rest Syntax）

「残りをまとめて受け取る」構文。スプレッドと記号（`...`）は同じだが、**使う場所が逆**。

- スプレッド：配列・オブジェクトを**展開する**
- レスト：残りの要素を**まとめる**

**関数の可変長引数**

```js
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // → 10（nums は [1, 2, 3, 4]）
```

**配列の分割代入と組み合わせる**

```js
const [first, ...rest] = [10, 20, 30, 40];
// first → 10
// rest  → [20, 30, 40]
```

**オブジェクトの分割代入と組み合わせる**

```js
const { name, ...others } = { name: "Alice", age: 25, role: "admin" };
// name   → "Alice"
// others → { age: 25, role: "admin" }
```

特定のプロパティだけ取り出して、残りをまとめたいときに使う。

---

### スプレッド vs レストの見分け方

| 文脈 | 構文 | 意味 |
|---|---|---|
| 代入の**右辺** / 関数の**引数**として渡す | スプレッド | 展開する |
| 代入の**左辺** / 関数の**仮引数**として受け取る | レスト | まとめる |

```js
const arr = [...[1, 2], 3];     // スプレッド：展開して配列を作る
const [a, ...b] = [1, 2, 3];   // レスト：残りをまとめる
function f(...args) {}          // レスト：引数をまとめて受け取る
f(...arr);                      // スプレッド：配列を引数として展開する
```

---

## ファサード関数

複雑な処理や複数の機能に対する「簡易的な窓口」となる関数を作成し、使い回す

下記例の場合

`createRankingTable` が「データ変換 → ソート → 描画」の流れを束ねる**ファサード関数**の役割を果たしている。イベントハンドラ側は `createRankingTable` を呼ぶだけで済み、処理の詳細を知らなくていい構造になっている。

各関数が単一の責務を持っている。

- `addRatioToData` → データ変換のみ
- `sortByValueDescending` → ソートのみ
- `renderTable` → 描画のみ

これにより、たとえば「ソートのロジックを変えたい」ときに `sortByValueDescending` だけを修正すればよく、他に影響が出にくい。

```js
// 例: 男女比ランキング
// 各関数の役割と関係
// 比率計算 ratioCalculate() 男性総数もしくは女性総数 / 総数 * 100 の計算のみを行う
// 比率追加 addRatioToData() ratioCalculate() を呼び出して結果を配列の末尾に追加
//  - 比率計算 ratioCalculate()
// ランキングテーブル作成 createRankingTable() 各関数を呼び出してランキングテーブルを作成 各関数のファサード関数 「データ変換 → ソート → 描画」の流れを束ねる
//  - 比率追加 addRatioToData()
//  - ソート sortByValueDescending()
//  - テーブル描画 renderTable()

/**
 * 比率計算
 * @param {string} part 分子
 * @param {string} total 分母
 * @returns {string} 比率（小数点以下1桁）
 */
function ratioCalculate (part, total) {
  const ratio = (parseInt(part, 10) / parseInt(total, 10)) * 100;
  return ratio.toFixed(1);
}

/**
 * 比率追加
 * @param {Array} array 配列データ
 * @returns {Array} 比率追加後の配列
 */
function addRatioToData (array) {
  return [...array].map((item) => {
    const totalPopulation = item[2];
    const malePopulation = item[3];
    const femalePopulation = item[4];
    const maleRatio = ratioCalculate(malePopulation, totalPopulation);
    const femaleRatio = ratioCalculate(femalePopulation, totalPopulation);
    return [...item, maleRatio, femaleRatio];
  });
}

/**
 * ソート
 * @param {Array} array 配列データ
 * @param {number} index ソート対象のインデックス
 * @returns {Array} ソート後の配列
 */
function sortByValueDescending (array, index) {
  const sortedArray = [...array].sort((a, b) => b[index] - a[index]);
  return sortedArray;
}

/**
 * テーブル描画
 * @param {Array} sortedArray ソート後の配列データ
 * @param {number} ratioIndex 比率インデックス 1: 男性比率 2: 女性比率
 */
function renderTable (sortedArray, ratioIndex) {
  const tableElement = document.createElement("table");
  tableElement.setAttribute("class", "mt-4 table-auto w-full text-center");
  const headerRow = document.createElement("tr");
  headerRow.setAttribute("class", "bg-gray-200");
  const rankHeader = document.createElement("th");
  rankHeader.setAttribute("class", "p-2");
  rankHeader.textContent = "順位";
  const areaHeader = document.createElement("th");
  areaHeader.setAttribute("class", "p-2");
  areaHeader.textContent = "都道府県名";
  const ratioHeader = document.createElement("th");
  ratioHeader.setAttribute("class", "p-2");
  ratioHeader.textContent = "比率";
  headerRow.append(rankHeader, areaHeader, ratioHeader);
  tableElement.appendChild(headerRow);
  result.appendChild(tableElement);
  sortedArray.forEach((item, index) => {
    const row = document.createElement("tr");
    row.setAttribute("class", "border-b border-gray-200")
    const rankCell = document.createElement("td");
    rankCell.setAttribute("class", "p-2");
    const areaCell = document.createElement("td");
    areaCell.setAttribute("class", "p-2");
    const ratioCell = document.createElement("td");
    ratioCell.setAttribute("class", "p-2");
    rankCell.textContent = `${index + 1}位`;
    areaCell.textContent = item[0];
    if (ratioIndex === 1) {
      ratioCell.textContent = `${item[7]}%`;
    } else {
      ratioCell.textContent = `${item[8]}%`;
    }
    row.append(rankCell, areaCell, ratioCell);
    tableElement.appendChild(row);
  });
}

/**
 * ランキングテーブル作成
 * @param {Array} array 配列データ
 * @param {number} index ソート対象のインデックス
 * @param {number} ratioIndex 比率インデックス 1: 男性比率 2: 女性比率
 */
function createRankingTable (array, index, ratioIndex) {
  if (result.hasChildNodes()) result.replaceChildren();

  const ratioAddedData = addRatioToData(array);
  const sortedData = sortByValueDescending(ratioAddedData, index);
  const title = document.createElement("h2");
  title.setAttribute("class", "text-lg font-bold mb-6 text-center pt-8");
  result.appendChild(title);
  if (ratioIndex === 1) {
    title.textContent = "男性比率ランキング";
  } else if (ratioIndex === 2) {
    title.textContent = "女性比率ランキング";
  }
  renderTable(sortedData, ratioIndex);
}

// ハンドラの中で使用
let censusData = null; // await はトップレベルでは（モジュール形式でない場合）使えないため、変数を宣言するだけ
window.addEventListener("DOMContentLoaded", async () => {
  censusData = await fetchCensusData(); // ここでデータ取得 以降データ使い回し
  createRankingTable(censusData, MALE_RATIO_INDEX, MALE_RATIO);
});

// 6. ボタンがクリックされたときの処理
maleRankingButton.addEventListener("click", () => {
  createRankingTable(censusData, MALE_RATIO_INDEX, MALE_RATIO);
});

femaleRankingButton.addEventListener("click", () => {
  createRankingTable(censusData, FEMALE_RATIO_INDEX, FEMALE_RATIO);
});
```

---

## ボタンを押したら送信、でも連打防止

```js
let isSending = false;

document.getElementById("btn").addEventListener("click", () => {
  if (isSending) return; // 送信中は無視

  isSending = true;
  console.log("送信中...");

  // 2秒後に送信完了（実際はAPIリクエストが終わったら）
  setTimeout(() => {
    console.log("送信完了！");
    isSending = false; // また押せるようにする
  }, 2000);
});
```

---

## `disabled` ボタンの状態管理

```js
// ボタン状態管理関数
function setButtonState(state) {
  startButton.disabled = state === "measuring" || state === "maxTime";
  stopButton.disabled = state === "initial" || state === "stopped" || state === "maxTime";
  resetButton.disabled = state === "initial";
}

startButton.addEventListener("click", () => {
  ...
  setButtonState("measuring"); // startButton の disabled を true に
});
```

---

## 一定時間操作がなければ自動ログアウト

```js
let logoutTimer;

function resetTimer() {
  clearTimeout(logoutTimer); // 前のタイマーをリセット
  logoutTimer = setTimeout(() => {
    console.log("5分間操作がないのでログアウトします");
  }, 5 * 60 * 1000); // 5分
}

// マウスやキーが動くたびにタイマーをリセット
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);

resetTimer(); // 最初に起動
```

---

## リアルタイム時計（ストップウォッチにも応用できる）

```js
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}

// 1秒ごとに時計を更新
const clockTimer = setInterval(updateClock, 1000);
updateClock(); // 最初の1秒を待たずに即表示

// ページを離れるときに止める（メモリリーク防止）
window.addEventListener("beforeunload", () => {
  clearInterval(clockTimer);
});
```

---

## ストップウォッチの時刻文字表示揺れ対応（ミリ秒表示で画面文字が揺れる）

```css
font-variant-numeric: tabular-nums;
```

```html
<!-- Tailwind CSS -->
<span id="minute" class="tabular-nums"></span>
```

---

## デバウンス（検索ボックスでよく使う）

```js
// 入力のたびにAPIを叩くと重いので、「入力が止まってから0.5秒後」に実行する
let searchTimer;

document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(searchTimer); // 入力のたびにリセット

  searchTimer = setTimeout(() => {
    console.log(`「${e.target.value}」で検索`); // 0.5秒止まったら実行
  }, 500);
});
```

---

## セッションストレージを利用して特定条件下で要素を非表示

```html
<!-- style="display:none;" でページ読み込み時の一瞬の表示を防ぐ（フラッシュ防止） -->
<div class="bn-float" style="display:none;">
  <a href="..." target="_blank" class="linkBtn">...</a>
  ...
</div>
<button class="closeBtn">...</button>
<script>
	const bnrElms = document.getElementsByClassName('bn-float');
	const linkElms = document.getElementsByClassName('linkBtn');
	const btnElms = document.getElementsByClassName('closeBtn');
  let bgNum = Math.ceil(2 * Math.random());
  bnrElms[0].classList.add(`background${bgNum}`);
  const keyName = 'element_float';
  const keyValue = true;
  function hideBanner () {
    sessionStorage.setItem(keyName, keyValue);
    bnrElms[0].remove();
  }
  if (!sessionStorage.getItem(keyName)) {
    bnrElms[0].style.display = "block";
  }
  linkElms[0].addEventListener('click', (e) => {
    e.stopPropagation();
    hideBanner();
  });
  btnElms[0].addEventListener('click', (e) => {
    e.stopPropagation();
    hideBanner();
  });
</script>
```

### 同様の機能の別の実装方法

**① CSS クラスの付け外し（推奨）**

現状はインライン `style` を直接操作しているが、クラスで管理する方がCSSとJSの役割が分かれて読みやすい。

```css
/* CSS */
.bn-float { display: none; }
.bn-float.is-visible { display: block; }
```

```js
// 表示
bnrElms[0].classList.add('is-visible');
// 非表示（削除ではなくクラスを外すだけ）
bnrElms[0].classList.remove('is-visible');
```

**② `hidden` 属性（セマンティックなHTML）**

`style` の代わりに HTML の `hidden` 属性を使う方法。`remove()` の代わりに `hidden = true` で消すことで、DOMに要素を残したまま非表示にできる。

```js
// 表示
bnrElms[0].hidden = false;
// 非表示
bnrElms[0].hidden = true;
```

**③ localStorage（タブを閉じても維持したい場合）**

`sessionStorage` はタブを閉じるとリセットされる。「一度閉じたら次回ブラウザを開いても表示しない」仕様にしたい場合は `localStorage` に変えるだけ。

```js
localStorage.setItem(keyName, keyValue);
localStorage.getItem(keyName);
```

**仕様に合わせた選び方：**

| 仕様 | 方法 |
|---|---|
| タブを閉じたらリセットしたい | `sessionStorage`（現状） |
| ブラウザを閉じても維持したい | `localStorage` |
| CSSとJSを分離したい | CSS クラス切り替え |
| DOMに残したまま隠したい | `hidden` 属性 |

---

## 日付と時刻関連

### ゼロ埋め（01, 09 などの2桁表示）

```js
const month = String(d.getMonth() + 1).padStart(2, '0');  // "06"
const day   = String(d.getDate()).padStart(2, '0');        // "15"
```

### YYYY-MM-DD 形式の文字列を作る

```js
const d = new Date();
const yyyymmdd = d.toISOString().slice(0, 10);
// → "2024-06-15"（UTCベースなので日本時間とずれる場合あり）

// 日本時間で確実に取得したい場合
const yyyy = d.getFullYear();
const mm   = String(d.getMonth() + 1).padStart(2, '0');
const dd   = String(d.getDate()).padStart(2, '0');
const dateStr = `${yyyy}-${mm}-${dd}`;  // "2024-06-15"
```

### N日後・N日前の日付を求める

```js
const d = new Date();
d.setDate(d.getDate() + 7);   // 7日後（setDate は月をまたいでも自動調整）
d.setDate(d.getDate() - 3);   // 3日前
```

### 月の末日を求める

```js
// 翌月の0日目 = 今月の末日
const lastDay = new Date(2024, 2, 0).getDate();  // 29（2024年2月の末日）
```

### 経過時間の計測（処理時間など）

```js
const start = Date.now();
// ...何らかの処理...
const elapsed = Date.now() - start;  // ミリ秒
console.log(`${elapsed}ms`);
```

### 曜日名を取得する

```js
const days = ['日', '月', '火', '水', '木', '金', '土'];
const dayName = days[new Date().getDay()];  // "土"
```

---

## データ駆動バリデーション（ルールを配列で管理する）

「ルール（データ）」と「実行ロジック」を分離するパターン。ルールが増えても実行ロジックを変更しなくてよい。

### 複数の関数を作るアプローチ（よくある）

```js
function checkNotEmpty(email) { ... }
function checkMaxLength(email) { ... }
function checkHasAt(email) { ... }

function validateEmail(email) {
  const r1 = checkNotEmpty(email);
  if (!r1.valid) return r1;
  const r2 = checkMaxLength(email);
  if (!r2.valid) return r2;
  // ルールが増えるたびにここも増える
}
```

ルールが増えるたびに `validateEmail` 本体も修正が必要になる。

### データ駆動アプローチ

```js
const rules = [
  { test: (email) => email.length > 0,    message: "入力してください" },
  { test: (email) => email.length <= 254, message: "254文字以内で..." },
  { test: (email) => email.includes("@"), message: "@を含めてください" },
  // ルールを追加してもここだけ変えればいい
];

function validateEmail(email) {
  for (const rule of rules) {
    if (!rule.test(email)) return { valid: false, error: rule.message };
  }
  return { valid: true };
}
```

`validateEmail` は「`rules` を順番に回して最初に失敗したものを返す」だけに専念しており、ルールの追加・削除に対して変更不要。

### ポイント

| | 複数関数アプローチ | データ駆動アプローチ |
|---|---|---|
| ルール追加時 | 実行関数も修正が必要 | `rules` 配列に1行追加するだけ |
| 実行ロジック | ルールごとに書く | 1つの `for` ループで完結 |
| 発想 | 処理を関数として定義 | ルールをデータとして定義 |

**出典：** `study-reading/misc/typescript/email-validation.ts`

---

## DOM 操作

### ボタンをクリックすると、対応するコンテンツだけが表示されるタブUI

クラス名でループ `forEach()` を回して、カスタムデータ属性とid値を照合して対応コンテンツを絞り込む

```html
    <section class="mb-6 pb-4 border-b-1 border-b-gray-200">
      <div class="flex gap-x-2 justify-center mb-2">
        <button type="button" data-tab="tab1" class="btn btn-primary font-bold text-base bg-sky-600 tab">タブ1を表示</button>
        <button type="button" data-tab="tab2" class="btn btn-primary font-bold text-base bg-sky-600 tab">タブ2を表示</button>
        <button type="button" data-tab="tab3" class="btn btn-primary font-bold text-base bg-sky-600 tab">タブ3を表示</button>
      </div>
      <div id="tab1" class="bg-sky-100 h-24 text-center pt-8 tab-content">タブ1の内容</div>
      <div id="tab2" class="bg-green-100 h-24 text-center pt-8 tab-content hidden">タブ2の内容</div>
      <div id="tab3" class="bg-indigo-100 h-24 text-center pt-8 tab-content hidden">タブ3の内容</div>
    </section>
```

```js
const tabButtons = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
tabButtons.forEach((tabButton) => {
  tabButton.addEventListener("click", () => {
    const target = tabButton.dataset.tab;
    tabContents.forEach((tabContent) => tabContent.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  });
});
```

### モーダル(開くボタンと閉じるボタンあり、背景クリックでも閉じる)

```html
    <section class="mb-6 pb-4 border-b-1 border-b-gray-200">
      <button type="button" id="openModal" class="btn btn-primary font-bold text-base bg-sky-600">モーダルを開く</button>
      <div id="wrapModal" class="modal fixed inset-0 bg-gray-500/50 flex justify-center items-center hidden">
        <div class="modal-content bg-white px-14 py-8 rounded-md text-center">
          <p class="text-center mb-2">モーダル表示</p>
          <button type="button" id="closeModal" class="btn btn-primary font-bold text-sm bg-gray-600">閉じる</button>
        </div>
      </div>
    </section>
```

```js
/** @type {HTMLDivElement | null} */
const modalWrap = document.getElementById("wrapModal");
/** @type {HTMLButtonElement | null} */
const modalOpenButton = document.getElementById("openModal");
/** @type {HTMLButtonElement | null} */
const modalCloseButton = document.getElementById("closeModal");

modalOpenButton.addEventListener("click", () => {
  modalWrap.classList.remove("hidden");
});
modalCloseButton.addEventListener("click", () => {
  modalWrap.classList.add("hidden");
});
// イベントのターゲットとmodalWrapの同一チェックがポイント
// これがないと modal-content クラスを持つ要素をクリックしてもモーダルが閉じてしまう
modalWrap.addEventListener("click", (e) => {
  if (e.target === modalWrap) {
    modalWrap.classList.add("hidden");
  }
});
```