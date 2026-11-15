<script>
    // 二次ベジェ曲線エディタ
    // 始点(0,0)・終点(1,1)は固定で、制御点(px, py)をドラッグして曲線の形を決める
    let { px = $bindable(0.5), py = $bindable(0) } = $props();

    const SIZE = 180; // グラフ本体の大きさ
    const PT = 14;    // 上の余白（制御点のつまみがはみ出さないように）
    const PR = 14;    // 右の余白
    const PB = 30;    // 下の余白（「時間」のラベル用）
    const PL = 30;    // 左の余白（「ダメージ量」のラベル用）
    const W = PL + SIZE + PR;
    const H = PT + SIZE + PB;

    // 0〜1 の値 ⇔ SVG座標（yは上が1）
    const toX = (v) => PL + v * SIZE;
    const toY = (v) => PT + (1 - v) * SIZE;

    let svg;
    let dragging = false;

    function move(e) {
        if (!dragging) return;
        const rect = svg.getBoundingClientRect();
        const scale = W / rect.width;
        const x = ((e.clientX - rect.left) * scale - PL) / SIZE;
        const y = 1 - ((e.clientY - rect.top) * scale - PT) / SIZE;
        // 0〜1に収める（xが範囲外だと時間が逆行し、yが範囲外だとHPが行き過ぎるため）
        px = Math.round(Math.min(1, Math.max(0, x)) * 100) / 100;
        py = Math.round(Math.min(1, Math.max(0, y)) * 100) / 100;
    }

    function down(e) {
        dragging = true;
        svg.setPointerCapture(e.pointerId);
        move(e);
    }

    function up() {
        dragging = false;
    }

    const presets = [
        { label: '一定', px: 0.5, py: 0.5 },
        { label: '加速（t²）', px: 0.5, py: 0 },
        { label: '減速', px: 0.5, py: 1 },
    ];
</script>

<div class="editor">
    <div class="plot">
    <svg
        bind:this={svg}
        viewBox="0 0 {W} {H}"
        onpointerdown={down}
        onpointermove={move}
        onpointerup={up}
        onpointercancel={up}
        role="img"
        aria-label="ダメージパターンの曲線（制御点 {px}, {py}）"
    >
        <!-- 目盛り -->
        {#each [0.25, 0.5, 0.75] as g}
            <line class="grid" x1={toX(g)} y1={toY(0)} x2={toX(g)} y2={toY(1)} />
            <line class="grid" x1={toX(0)} y1={toY(g)} x2={toX(1)} y2={toY(g)} />
        {/each}
        <rect class="frame" x={PL} y={PT} width={SIZE} height={SIZE} />

        <!-- 制御点への補助線 -->
        <line class="guide" x1={toX(0)} y1={toY(0)} x2={toX(px)} y2={toY(py)} />
        <line class="guide" x1={toX(1)} y1={toY(1)} x2={toX(px)} y2={toY(py)} />

        <!-- 二次ベジェ曲線 -->
        <path class="curve" d="M {toX(0)} {toY(0)} Q {toX(px)} {toY(py)} {toX(1)} {toY(1)}" />

        <circle class="handle" cx={toX(px)} cy={toY(py)} r="7" />

        <text class="label" x={PL + SIZE / 2} y={H - 10} text-anchor="middle">時間</text>
        <text class="label vertical" x={PL - 14} y={PT + SIZE / 2} text-anchor="middle">ダメージ量</text>
    </svg>
    </div>

    <div class="side">
        <div class="value">制御点<br />{px.toFixed(2)}, {py.toFixed(2)}</div>
        {#each presets as p}
            <button type="button" onclick={() => { px = p.px; py = p.py; }}>{p.label}</button>
        {/each}
    </div>
</div>

<style>
    .editor { display: flex; gap: 14px; align-items: flex-start; }
    .plot { flex: 1; max-width: 280px; }
    svg {
        display: block; width: 100%; background: #1b1f33;
        touch-action: none; user-select: none; cursor: crosshair;
    }
    .frame { fill: none; stroke: #5a6186; stroke-width: 1; }
    .grid { stroke: #2f3553; stroke-width: 1; }
    .guide { stroke: #7c84a8; stroke-width: 1; stroke-dasharray: 3 3; }
    .curve { fill: none; stroke: #3ccf5a; stroke-width: 3; }
    .handle { fill: #f3c74a; stroke: #1b1f33; stroke-width: 2; cursor: grab; }
    .label { font-size: 12px; fill: #c5cadc; }
    .vertical { writing-mode: vertical-rl; }
    .side { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
    .value { color: #c5cadc; margin-bottom: 2px; line-height: 1.4; }
    .side button {
        padding: 5px 8px; font: inherit; cursor: pointer; text-align: left; white-space: nowrap;
        background: transparent; color: #e8eaf2; border: 2px solid #5a6186; border-radius: 6px;
    }
    .side button:hover { border-color: #f3c74a; }
</style>
