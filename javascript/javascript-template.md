# JavaScript 基礎　コード定型文

0 からコードを書き出す際、下記の流れを意識すると書き出しやすい

```js
// コードの構成
// 1. HTML要素を取得
// 2. リストデータとなる配列を用意（APIやストレージからデータを読み込むのもここで）
// 3. 各関数を作成
//  - submit ボタン状態の切り替え setSubmitEnabled()
//  - 空文字バリデーション validateNotEmpty()
//  - 配列の内容をHTMLに反映 renderTasks()
//  - 新しいタスクを配列に追加 addTask()
//  - 配列からタスクを削除する関数を作成 removeTask()
//  - タスクの完了状態を切り替える toggleTaskDone()（オプション）
// 4. イベントリスナー
//  - DOMContentLoaded
//  - blur
//  - input
//  - submit
//  - reset

// 1. HTML要素を取得
/** @type {HTMLTextAreaElement | null} */ 
const taskInput = document.querySelector('#task-input');
/** @type {HTMLFormElement | null} */ 
const taskForm = document.querySelector("#task-form");
/** @type {HTMLButtonElement | null} */
const submitButton = document.querySelector("button[type='submit']");
/** @type {HTMLButtonElement | null} */
// ... などなど

// 2. リストデータを格納する配列（APIやストレージからデータを読み込むのもここで）
// const だと再代入できないため、let にする
const initialTasks = [
  { id: 1, title: "牛乳を買う", done: false },
  { id: 2, title: "コードを書く", done: true },
  { id: 3, title: "散歩する", done: false },
];
let tasks = [...initialTasks];

// ここに早期リターンがあっても良い

// 書き方1
// if (!taskInput || !taskForm || !statusMessage) {
//   console.error("必要なHTML要素が見つかりませんでした");
//   // 必要な要素がない場合はこれ以上処理を続けない
//   throw new Error("必要なHTML要素が見つかりませんでした");
// ↑例外を投げてスクリプト全体を停止。ブラウザの DevTools コンソールに赤いエラーとしてスタックトレース付きで表示される
// }

// 書き方2
// if (!taskInput || !taskForm || !statusMessage) {
//   console.error("必要なHTML要素が見つかりませんでした");
//   // 必要な要素がない場合はこれ以上処理を続けない
//   return;
// return の場合、構文エラーとなる（このコードがトップレベル（関数の外）にあるため）
// }

// 書き方2の場合、ここはスクリプトのトップレベル（module スコープ）なので関数の中ではない。トップレベルでは return は使えないため、ここで処理を止めたい場合は throw が唯一の手段となる

// 3. 各関数を作成
//  - submit ボタン状態の切り替え setSubmitEnabled()
/**
 * submit ボタン状態の切り替え
 * @param {boolean} enabled 活性化状態かどうか
 */
function setSubmitEnabled(enabled) {
  submitButton.disabled = !enabled;
  submitButton.classList.toggle("bg-gray-400", !enabled);
  submitButton.classList.toggle("cursor-not-allowed", !enabled);
  submitButton.classList.toggle("bg-sky-600", enabled);
  submitButton.classList.toggle("cursor-pointer", enabled);
}
setSubmitEnabled(false); // 初期状態は非活性化

//  - 空文字バリデーション validateNotEmpty()
/**
 * 空文字バリデーション
 * @param {HTMLInputElement} element DOM要素
 * @returns {boolean} バリデーション結果
 */
function validateNotEmpty(element) {
  return element.value.trim() !== "";
}
// ... などなど

// 4. イベントリスナー
//  - DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(tasks);
});

//  - blur
// macOS ではボタンクリック時に relatedTarget が null になるため、mousedown フラグで代替する
let isResetClicking = false;
resetButton.addEventListener("mousedown", () => { isResetClicking = true; });
resetButton.addEventListener("mouseup", () => { isResetClicking = false; });
taskInput.addEventListener("blur", () => {
  if (isResetClicking) return;
  const isValid = validateNotEmpty(taskInput);
  taskInputError.textContent = isValid ? "" : "タスクタイトルを入力してください";
  setSubmitEnabled(isValid);
});
// ... などなど
```