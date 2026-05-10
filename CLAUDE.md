- @./package.json

# nalloc

プロジェクト名の空き状況を各プラットフォームで一括チェックするインタラクティブ CLI ツール

## 使い方

```bash
bun src           # 名前を入力
bun src <name>    # 直接指定
```

## 操作方法

- ↑↓ / j/k: 項目を選択
- Enter / Z: 選択した項目をチェック
- /: 検索モード (TLD を絞り込み)
- Esc: 検索解除
- Q: 終了

## チェック対象

- npm: registry.npmjs.org
- GitHub User: api.github.com/users
- GitHub Repo: api.github.com/repos (同名user/repo)
- PyPI: pypi.org
- crates.io: Rust パッケージレジストリ
- ドメイン: Cloudflare Registrar で購入可能な全 TLD (DNS解決)

## キャッシュ

結果は ~/.config/nalloc/cache.json にキャッシュされる (24時間有効)

## ディレクトリ構成

```
src/
  index.ts            # エントリポイント
  version.ts          # バージョン定数
  data/               # 静的データ (TLD リストなど)
  lib/                # terminal, cache
  types/              # 型定義
  checkers/           # 各プラットフォームのチェッカー
  ui/                 # open-tui (宣言的 TUI ライブラリ) + interactive.ts
  utils/              # parse-args
```

## 開発

```bash
bun install
bun run dev     # watch モード
bun run build   # ビルド
```
