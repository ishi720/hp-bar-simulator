<script>
    // ゲージの色と、色が切り替わる残りHPの割合の入力
    import { GaugeColors } from '../lib/GaugeColors.svelte.js';

    /** @type {{ colors: GaugeColors }} */
    let { colors } = $props();
</script>

<div class="rows">
    <div class="row">
        <span class="label">通常</span>
        <input type="color" aria-label="通常の色" bind:value={colors.high} />
    </div>

    <div class="row">
        <span class="label">注意</span>
        <input type="color" aria-label="注意の色" bind:value={colors.mid} />
        <label class="percent">
            <input type="number" min="0" max="100" aria-label="注意になる割合" bind:value={colors.midAt} />
            <span>% 以下</span>
        </label>
    </div>

    <div class="row">
        <span class="label">危険</span>
        <input type="color" aria-label="危険の色" bind:value={colors.low} />
        <label class="percent">
            <input type="number" min="0" max="100" aria-label="危険になる割合" bind:value={colors.lowAt} />
            <span>% 以下</span>
        </label>
    </div>

    <div class="row">
        <span class="label">残像</span>
        <input type="color" aria-label="残像の色" bind:value={colors.trail} />
    </div>
</div>

<style>
    .rows {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 15px;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .label {
        width: 3em;
    }

    .percent {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    input[type="color"] {
        width: 48px;
        height: 36px;
        padding: 3px;
        background: #1b1f33;
        border: 2px solid #5a6186;
        border-radius: 6px;
        cursor: pointer;
    }

    input[type="number"] {
        width: 80px;
        padding: 7px 10px;
        font: inherit;
        font-size: 16px;
        background: #1b1f33;
        color: #e8eaf2;
        border: 2px solid #5a6186;
        border-radius: 6px;
    }
</style>
