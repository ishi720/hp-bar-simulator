<script>
    // 表示専用のグラフ（横：時間、縦：ダメージ量）
    // lines: [{ kind: 'main' | 'trail', points: [[x, y], ...] }]  x, y は 0〜1
    let { lines = [], caption = '' } = $props();

    const SIZE = 180; // グラフ本体の大きさ
    const PT = 14;    // 上の余白
    const PR = 14;    // 右の余白
    const PB = 30;    // 下の余白（「時間」のラベル用）
    const PL = 30;    // 左の余白（「ダメージ量」のラベル用）
    const W = PL + SIZE + PR;
    const H = PT + SIZE + PB;
    const toX = (v) => PL + v * SIZE;
    const toY = (v) => PT + (1 - v) * SIZE;
    const path = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${toX(x).toFixed(1)} ${toY(y).toFixed(1)}`).join(' ');
</script>

<div>
    <svg viewBox="0 0 {W} {H}" role="img" aria-label="ダメージパターンのグラフ">
        {#each [0.25, 0.5, 0.75] as g}
            <line class="grid" x1={toX(g)} y1={toY(0)} x2={toX(g)} y2={toY(1)} />
            <line class="grid" x1={toX(0)} y1={toY(g)} x2={toX(1)} y2={toY(g)} />
        {/each}
        <rect class="frame" x={PL} y={PT} width={SIZE} height={SIZE} />
        {#each lines as line}
            <path class={line.kind} d={path(line.points)} />
        {/each}
        <text class="label" x={PL + SIZE / 2} y={H - 10} text-anchor="middle">時間</text>
        <text class="label vertical" x={PL - 14} y={PT + SIZE / 2} text-anchor="middle">ダメージ量</text>
    </svg>
    <p class="caption">{caption}</p>
</div>

<style>
    svg { display: block; width: 100%; max-width: 320px; background: #1b1f33; }
    .frame { fill: none; stroke: #5a6186; stroke-width: 1; }
    .grid { stroke: #2f3553; stroke-width: 1; }
    path { fill: none; stroke-width: 3; stroke-linejoin: round; }
    .main { stroke: #3ccf5a; }
    .trail { stroke: #ff5c6c; }
    p { margin: 6px 0 0; }
    .label { font-size: 12px; fill: #c5cadc; }
    .vertical { writing-mode: vertical-rl; }
    .caption { font-size: 14px; }
</style>
