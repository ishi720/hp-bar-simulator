<script>
    // キャラ名・レベル・最大HPの入力
    import { Character } from '../lib/Character.svelte.js';

    /** @type {{ character: Character }} */
    let { character } = $props();
</script>

<div class="fields">
    <label class="name">
        <span>キャラ名</span>
        <input type="text" maxlength="12" bind:value={character.name} />
    </label>
    <label>
        <span>レベル</span>
        <input type="number" min="1" max="999" bind:value={character.level} />
    </label>
    <label>
        <span>最大HP</span>
        <input type="number" min="1" max="99999" bind:value={character.maxHp} />
    </label>
</div>

<style>
    .fields {
        display: grid;
        grid-template-columns: 1fr 88px 104px;
        gap: 10px;
        font-size: 15px;
    }
    label { display: block; min-width: 0; }
    span { display: block; margin-bottom: 6px; }
    input {
        width: 100%;
        padding: 7px 10px;
        font: inherit;
        font-size: 16px;
        background: #1b1f33;
        color: #e8eaf2;
        border: 2px solid #5a6186;
        border-radius: 6px;
    }
    @media (max-width: 360px) {
        .fields { grid-template-columns: 1fr 1fr; }
        .name { grid-column: 1 / -1; }
    }
</style>
