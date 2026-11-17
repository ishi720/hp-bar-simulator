<script>
    // HPバーの見た目だけを担当する。状態と処理は HpBar クラスが持つ
    import { onDestroy } from 'svelte';
    import { HpBar } from '../lib/HpBar.svelte.js';

    /** @type {{ bar: HpBar }} */
    let { bar } = $props();

    onDestroy(() => bar.dispose());

    // 残像ありのときだけ、緑ゲージにも少しだけトランジションをかける
    const transition = $derived(bar.trail ? 'width .15s ease-out' : 'none');
</script>

<section class="card">
    <div class="name"><span>{bar.name}</span><span>Lv{bar.level}</span></div>
    <div class="hp">
        <span class="label">HP</span>
        <div class="track">
            {#if bar.trail}
                <div
                    class="trail"
                    style:width="{bar.trailRatio * 100}%"
                    style:background={bar.trailColor}
                    style:transition={transition}
                ></div>
            {/if}
            <div
                class="fill"
                style:width="{bar.ratio * 100}%"
                style:background={bar.fillColor}
                style:transition={transition}
            ></div>
        </div>
    </div>
    <div class="nums">{bar.shownHp} / {bar.max}</div>
    <div class="btns">
        <button onclick={() => bar.damage(bar.max / 2)}>半分ダメージ</button>
        <button onclick={() => bar.damage(bar.max)}>全ダメージ</button>
        <button onclick={() => bar.heal(bar.max)}>回復</button>
    </div>
</section>

<style>
    .card {
        width: 100%;
        max-width: 560px;
        padding: clamp(18px, 3vw, 32px);
        font-size: clamp(16px, 2vw, 20px);
        font-weight: bold;
        line-height: 1.5;
        background: #fbf6e6;
        color: #2b2b2b;
        border: 4px solid #2b2b2b;
        border-radius: 6px;
        box-shadow: inset 0 0 0 3px #d9cfae;
    }
    .name { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .hp { display: flex; align-items: center; gap: 10px; }
    .label {
        background: #2b2b2b; color: #f3c74a; font-size: .7em; line-height: 1;
        padding: 3px 6px; border-radius: 3px;
    }
    .track {
        position: relative; flex: 1; overflow: hidden;
        height: clamp(12px, 1.6vw, 16px); background: #4a4a4a; border-radius: 8px;
        border: 2px solid #2b2b2b;
    }
    .fill, .trail { position: absolute; top: 0; bottom: 0; left: 0; }
    .fill::after { /* 上半分のハイライト */
        content: ""; position: absolute; left: 0; right: 0; top: 0; height: 40%;
        background: rgba(255, 255, 255, .35);
    }
    .nums { text-align: right; margin-top: 4px; }
    .btns { display: flex; gap: 8px; margin-top: 20px; }
    .btns button {
        flex: 1; padding: 10px 4px; cursor: pointer; font: inherit; font-size: .8em; white-space: nowrap;
        background: #2b2b2b; color: #fbf6e6; border: 0; border-radius: 4px;
    }
</style>
