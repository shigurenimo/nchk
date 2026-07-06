- @./package.json

# nalloc

プロジェクト名の空き状況を各プラットフォームで一括チェックするインタラクティブ CLI ツール

## 使い方

```bash
bun src           # 名前を入力
bun src <name>    # 直接指定
```

## 操作方法

- 文字入力 / Backspace: 名前を編集 (".xx" と入力するとドメインを TLD 前方一致で絞り込み)
- ↑↓ / PgUp/PgDn: 項目を選択
- Enter: 選択した項目をチェック
- Tab: 表示中の未チェック項目をすべてチェック (並列実行)
- Esc / Ctrl+C: 終了

非 TTY (パイプや CI) では対話モードに入らず、主要レジストリと代表的な TLD を一括チェックして標準出力に結果を表示する。

## チェック対象

- npm: registry.npmjs.org
- GitHub User: api.github.com/users
- PyPI: pypi.org
- crates.io: Rust パッケージレジストリ
- ドメイン: Cloudflare Registrar で購入可能な全 TLD (NS レコードの DNS 解決)

## キャッシュ

結果は ~/.config/nchk/cache.json にキャッシュされる (8時間有効、2日で削除)

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
