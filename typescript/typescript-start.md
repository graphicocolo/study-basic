# TypeScript 環境構築

TypeScript の開発環境を構築する方法はいくつかあります。代表的な方法を **3つのカテゴリー** に分けて解説します。

- 1. ローカルに TypeScript をインストール（プロジェクト単位）
- 2. グローバルに TypeScript をインストール
- 3. バンドラー（Webpack, Vite, esbuild, Parcel）を使って構築

---

# **1. ローカルに TypeScript をインストール（プロジェクト単位）**
プロジェクトごとに TypeScript を管理する方法。**最も推奨される方法** です。

### **方法**
```sh
mkdir my-ts-project
cd my-ts-project
npm init -y
npm install --save-dev typescript
npx tsc --init
```

### **特徴**
✅ プロジェクトごとに異なるバージョンの TypeScript を管理できる  
✅ `npx tsc` または `npm run build` でコンパイル可能  
✅ `node_modules/.bin/tsc` を使うため、`~/.zshrc` の設定不要  

### **向いている場面**
- チーム開発（他の開発者とバージョンを揃えたい）
- プロジェクトごとに TypeScript の設定をカスタマイズしたい

---

# **2. グローバルに TypeScript をインストール**
マシン全体で TypeScript を利用できるようにする方法。

### **方法**
```sh
npm install -g typescript
```

### **特徴**
✅ `tsc` をどこでも実行可能（`npx` を使わなくてよい）  
✅ 環境をまたいで同じ TypeScript バージョンを使用可能  

### **向いている場面**
- ちょっとしたスクリプトを書くとき
- **複数のプロジェクトで同じ TypeScript バージョンを使いたい**
- `npx tsc` を使いたくない

### **デメリット**
⚠️ プロジェクトごとの TypeScript バージョンが異なると問題が発生する  
⚠️ チーム開発には向かない（各開発者の環境でバージョンが異なる可能性がある）

---

# **3. バンドラー（Webpack, Vite, esbuild, Parcel）を使って構築**
フロントエンド開発で TypeScript を使う場合、**バンドラーと統合** すると便利です。

### **代表的なバンドラー**
| バンドラー | 特徴 |
|-----------|------|
| **Webpack** | 柔軟性が高いが設定が多め |
| **Vite** | 高速（開発サーバーが軽量） |
| **esbuild** | 超高速コンパイル |
| **Parcel** | 設定不要で簡単 |

---

## **（1）Vite を使う（推奨）**
Vite は **開発環境が軽量＆高速** なのでオススメ。

### **方法**
```sh
npm create vite@latest my-vite-app --template react-ts
cd my-vite-app
npm install
npm run dev
```

### **特徴**
✅ 開発サーバーが高速  
✅ `.tsx` ファイルをそのまま使える  
✅ `tsconfig.json` の設定が自動で作成される  

### **向いている場面**
- **React や Vue で TypeScript を使う場合**
- **モダンなフロントエンド開発**

---

## **（2）Webpack + TypeScript**
古くから使われている定番の組み合わせ。設定は少し多い。

### **方法**
```sh
npm install --save-dev typescript ts-loader webpack webpack-cli
npx tsc --init
```
次に、`webpack.config.js` に TypeScript の設定を追加：
```js
module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
  resolve: { extensions: [".ts", ".js"] },
};
```

### **特徴**
✅ **カスタマイズ性が高い**  
✅ **多くの Web プロジェクトで使われている**  
⚠️ **設定が多く、初心者には少し難しい**  

### **向いている場面**
- **カスタマイズが必要な大規模プロジェクト**
- **企業の Web 開発で TypeScript を導入する場合**

---

# **4. どの方法を選ぶべきか？**
| 方法 | 特徴 | 向いている場面 |
|------|------|------------|
| **ローカルにインストール**（`npm install typescript`） | **プロジェクト単位で管理**、バージョンを揃えられる | **ほとんどの開発（推奨）** |
| **グローバルにインストール**（`npm install -g typescript`） | どこでも `tsc` を使える | **単発のスクリプト、個人開発** |
| **Vite を使う**（`npm create vite@latest my-app --template react-ts`） | **高速なフロントエンド開発** | **React/Vue などの開発** |
| **Webpack を使う**（`npm install webpack typescript ts-loader`） | 柔軟なカスタマイズが可能 | **大規模プロジェクト** |

---

# **結論**
✅ **Node.js のバックエンドや小規模な TypeScript 開発** → **ローカルインストール（`npm install typescript`）**  
✅ **グローバルで気軽に使いたい** → **`npm install -g typescript`**  
✅ **React/Vue などのフロントエンド開発** → **Vite（`npm create vite@latest my-app --template react-ts`）**  
✅ **カスタマイズが必要な大規模開発** → **Webpack（`npm install webpack typescript ts-loader`）**

TypeScript をどう使うかによって、適切な環境構築方法を選びましょう！