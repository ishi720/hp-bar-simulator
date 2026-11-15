# HPバーシミュレーター

HPバー動作のシミュレーターです

```sh
npm install
npm run dev
```

## 構成

```
src/
├── lib/
│   ├── motions.svelte.js  減り方（Strategy）
│   │   ├── Motion          基底クラス：duration() と progress() を実装すれば動く
│   │   ├── InstantMotion   一瞬で減る
│   │   ├── StepMotion      段階的に減る
│   │   ├── CurveMotion     曲線に沿って減る
│   │   ├── LinearMotion    一定の速さで減る
│   │   └── BounceMotion    バウンドして減る
│   ├── Gauge.svelte.js    表示値を Motion に従って目標値まで動かす
│   ├── Character.svelte.js キャラ名・レベル・最大HP（全パターンで共有）
│   ├── HpBar.svelte.js    HP本体（HpBar）と残像（Trail）
│   └── easing.js          二次ベジェ曲線の計算
└── components/
    ├── Section.svelte        開閉できるセクション
    ├── CharacterSettings.svelte キャラ名・レベル・最大HPの入力
    ├── HpBarView.svelte      HPバーの見た目
    ├── MotionSettings.svelte 減り方ごとの設定とグラフ
    ├── Graph.svelte          時間 → ダメージ量 のグラフ
    └── CurveEditor.svelte    ドラッグで曲線を決めるエディタ
```


