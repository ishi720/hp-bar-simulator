<script>
    import { untrack } from 'svelte';
    import { HpBar } from './lib/HpBar.svelte.js';
    import { Character } from './lib/Character.svelte.js';
    import { GaugeColors } from './lib/GaugeColors.svelte.js';
    import { InstantMotion, StepMotion, CurveMotion, LinearMotion, BounceMotion } from './lib/motions.svelte.js';
    import Section from './components/Section.svelte';
    import CharacterSettings from './components/CharacterSettings.svelte';
    import GaugeColorSettings from './components/GaugeColorSettings.svelte';
    import MotionSettings from './components/MotionSettings.svelte';
    import HpBarView from './components/HpBarView.svelte';
    import './styles/base.css';
    import './styles/app.css';

    // キャラクターとゲージの色は全パターンで共有する
    const character = new Character({ name: '桃太郎', level: 100, maxHp: 1000 });
    const colors = new GaugeColors();

    const bars = [
        new HpBar({ character, colors, motion: new InstantMotion() }),
        new HpBar({ character, colors, motion: new StepMotion({ stepHp: 1, msPerStep: 8 }) }),
        new HpBar({ character, colors, motion: new CurveMotion({ fullMs: 2000, px: 0.5, py: 0 }) }),
        new HpBar({ character, colors, motion: new LinearMotion({ speed: 4 }), trail: true }),
        new HpBar({ character, colors, motion: new BounceMotion({ fullMs: 1500, bounces: 1, restitution: 0.4 }) }),
    ];

    // 最大HPが変わったら、全パターンのHPを満タンに戻す
    $effect(() => {
        character.safeMaxHp;
        untrack(() => bars.forEach((b) => b.reset()));
    });

    let selected = $state(0); // 表示中のパターン
    const bar = $derived(bars[selected]);
</script>

<main class="app">
    <header class="app-title">
        <h1 class="title-text"><span class="title-hp">HP</span>バーシミュレーター</h1>
        <span class="title-gauge" aria-hidden="true">
            <i class="title-gauge-trail"></i>
            <i class="title-gauge-fill"></i>
        </span>
    </header>

    <div class="app-layout">
        <aside class="app-controls">
            <Section title="キャラ設定" open={false}>
                <CharacterSettings {character} />
            </Section>

            <Section title="ダメージ動作設定">
                <label class="pattern-picker">
                    <span class="pattern-picker-label">ダメージパターン</span>
                    <select class="pattern-picker-select" bind:value={selected}>
                        {#each bars as b, i}
                            <option value={i}>{b.title}</option>
                        {/each}
                    </select>
                </label>
                {#key selected}
                    <div class="pattern-motion"><MotionSettings {bar} /></div>
                {/key}
            </Section>

            <Section title="ゲージの色" open={false}>
                <GaugeColorSettings {colors} />
            </Section>
        </aside>

        <div class="app-stage">
            {#key selected}
                <HpBarView {bar} />
            {/key}
        </div>
    </div>
</main>
