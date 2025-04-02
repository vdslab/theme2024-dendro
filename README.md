# 樹状フローマップ可視化アプリケーション

このプロジェクトは、地理的な地点間の流れを視覚化するための樹状フローマップを生成する React アプリケーションです。特に、人や物の移動を視覚的に表現することに焦点を当てています。

## 主な機能

- **樹状フローマップの生成**: 選択された都道府県から他の都道府県への流れを樹状フローマップとして表示
- **人流・物流データの可視化**: 人の移動や物の流れを視覚的に表現
- **コスト関数ベースの最適化**: フローの幅を最適化するための高度なアルゴリズム
- **インタラクティブな操作**: ズームやパンなどの操作が可能

## 技術的特徴

### 1. スパイラルツリーを使用したレイアウト

論文「Flow Map Layout via Spiral Trees」に基づき、対数螺旋（logarithmic spiral）を使用した「スパイラルツリー」という新しいタイプのシュタイナー木を実装しています。これにより、以下の特性を持つフローマップが生成されます：

- 交差のないフローマップ
- 自然で滑らかな曲線によるバンドリング
- 視覚的に美しいレイアウト

### 2. コスト関数ベースの幅最適化

フローの幅を最適化するために、コスト関数ベースのアプローチを採用しています。以下のコスト関数を組み合わせて、最適な幅を求めています：

- **流量保存コスト**: 親ノードの幅と子ノードの幅の合計の差を最小化
- **視覚的バランスコスト**: 同じ深さのノード間の幅のバランスを評価
- **最小幅制約コスト**: すべてのエッジに最小幅を保証
- **滑らかさコスト**: 幅の急激な変化を抑制

詳細については、[コスト関数に基づく樹状フローマップの最適化](docs/cost_function_optimization.md)を参照してください。

## 開発環境

このプロジェクトは、React + Vite を使用して開発されています。

### 使用技術

- **フロントエンド**: React, D3.js
- **ビルドツール**: Vite
- **スタイリング**: CSS-in-JS

### 開発サーバーの起動

```bash
npm install
npm run dev
```

## プロジェクト構造

```
theme2024-dendro/
├── docs/                   # ドキュメント
│   └── cost_function_optimization.md  # コスト関数最適化の説明
├── public/                 # 静的ファイル
│   ├── data/               # データファイル
│   │   ├── dendriticFlowMapData.json  # 樹状フローマップのデータ
│   │   ├── historyBackgroundData.json # 歴史的背景データ
│   │   ├── prefectures.geojson        # 都道府県の地理データ
│   │   └── flowData/      # フローデータ
│   │       ├── material/  # 物流データ
│   │       └── people/    # 人流データ
│   └── vite.svg           # Viteのロゴ
├── src/                    # ソースコード
│   ├── components/         # コンポーネント
│   │   ├── aside/          # サイドバーコンポーネント
│   │   ├── charts/         # チャートコンポーネント
│   │   ├── common/         # 共通コンポーネント
│   │   ├── dendriticFlowMap/ # 樹状フローマップコンポーネント
│   │   ├── flowMap/        # フローマップコンポーネント
│   │   └── historyBackground/ # 歴史的背景コンポーネント
│   ├── constants/          # 定数
│   ├── context/            # Reactコンテキスト
│   ├── features/           # 機能モジュール
│   │   ├── dendriticFlowMap/ # 樹状フローマップの機能
│   │   │   ├── calcWidth.js  # 従来の幅計算
│   │   │   ├── optimizeWidth.js # コスト関数ベースの幅最適化
│   │   │   └── spiralTreeLayout.js # スパイラルツリーのレイアウト
│   │   ├── flowMap/        # フローマップの機能
│   │   └── map/            # 地図の機能
│   ├── functions/          # ユーティリティ関数
│   ├── hooks/              # カスタムフック
│   ├── provider/           # プロバイダー
│   ├── styles/             # スタイル
│   ├── App.jsx             # アプリケーションのルートコンポーネント
│   └── main.jsx            # エントリーポイント
├── .gitignore              # Gitの除外ファイル設定
├── eslint.config.js        # ESLintの設定
├── index.html              # HTMLテンプレート
├── package.json            # パッケージ設定
├── package-lock.json       # パッケージのロックファイル
├── README.md               # このファイル
└── vite.config.js          # Viteの設定
```

## 参考文献

- Kevin Verbeek, Kevin Buchin, and Bettina Speckmann. "Flow Map Layout via Spiral Trees". IEEE Transactions on Visualization and Computer Graphics, 2011.
