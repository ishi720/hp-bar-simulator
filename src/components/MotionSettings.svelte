<script>
    // 減り方（Motion）ごとの設定とグラフ
    import { HpBar } from '../lib/HpBar.svelte.js';
    import { StepMotion, CurveMotion, LinearMotion, BounceMotion } from '../lib/motions.svelte.js';
    import Graph from './Graph.svelte';
    import CurveEditor from './CurveEditor.svelte';

    /** @type {{ bar: HpBar }} */
    let { bar } = $props();

    const motion = $derived(bar.motion);
    const graph = $derived(bar.graph(bar.max / 2));
    const fmt = (sec) => sec.toFixed(2) + '秒';
    const caption = $derived(
        bar.trail
            ? `半分ダメージで 緑${fmt(graph.seconds)}／残像${fmt(graph.trailSeconds)}`
            : `半分ダメージで ${fmt(graph.seconds)}`
    );
</script>

<div class="settings">
    {#if motion instanceof StepMotion}
        <label>
            <span>一度に減る数<b>{motion.stepHp}</b></span>
            <input type="range" min="1" max="50" step="1" bind:value={motion.stepHp} />
        </label>
        <label>
            <span>減る速度<b>{motion.msPerStep}msごと（{motion.hpPerSecond}HP/秒）</b></span>
            <input type="range" min="1" max="30" step="1" bind:value={motion.msPerStep} />
        </label>
    {:else if motion instanceof CurveMotion}
        <label>
            <span>減る速度<b>バー1本ぶんを{(motion.fullMs / 1000).toFixed(1)}秒</b></span>
            <input type="range" min="200" max="5000" step="100" bind:value={motion.fullMs} />
        </label>
    {:else if motion instanceof LinearMotion}
        <label>
            <span>減る速度<b>{Math.round(motion.speed * bar.max)}HP/秒</b></span>
            <input type="range" min="0.5" max="10" step="0.5" bind:value={motion.speed} />
        </label>
    {:else if motion instanceof BounceMotion}
        <label>
            <span>減る速度<b>バー1本ぶんを{(motion.fullMs / 1000).toFixed(1)}秒</b></span>
            <input type="range" min="300" max="5000" step="100" bind:value={motion.fullMs} />
        </label>
        <label>
            <span>バウンド回数<b>{motion.bounces}回</b></span>
            <input type="range" min="1" max="6" step="1" bind:value={motion.bounces} />
        </label>
        <label>
            <span>跳ね返りの強さ<b>{Math.round(motion.restitution * 100)}%</b></span>
            <input type="range" min="0.1" max="0.8" step="0.05" bind:value={motion.restitution} />
        </label>
    {/if}

    <div class="graph">
        {#if motion instanceof CurveMotion}
            <p class="hint">黄色い点をドラッグすると曲線が変わります</p>
            <CurveEditor bind:px={motion.px} bind:py={motion.py} />
            <p class="caption">{caption}</p>
        {:else}
            <Graph lines={graph.lines} {caption} />
        {/if}
    </div>
</div>

<style>
    .settings { display: flex; flex-direction: column; gap: 18px; font-size: 15px; }
    label { display: block; }
    label > span { display: flex; justify-content: space-between; margin-bottom: 8px; }
    label b { color: #f3c74a; }
    .hint { margin: 0 0 8px; font-size: 13px; color: #c5cadc; }
    .caption { margin: 6px 0 0; font-size: 14px; }
</style>
