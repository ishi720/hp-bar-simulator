import { Gauge } from './Gauge.svelte.js';

/**
 * 残像：ダメージを受けたら、少し待ってから本体と同じ動きで追いかける
 * 回復中は本体のゲージに重ねて隠す（follow）
 */
export class Trail {
    follow = $state(false);
    #timer = 0;

    /**
     * @param {Gauge} gauge 残像用のゲージ
     * @param {number} delay 追いかけ始めるまでの待ち時間（ms）
     */
    constructor(gauge, delay) {
        this.gauge = gauge;
        this.delay = delay;
    }

    /** from（ダメージ直前の本体の表示値）から to まで遅れて追いかける */
    chase(from, to) {
        if (this.follow) this.gauge.jumpTo(from); // 隠れていた場合は本体の位置から始める
        this.follow = false;
        this.cancel();
        this.#timer = setTimeout(() => this.gauge.moveTo(to), this.delay);
    }

    /** 本体のゲージの後ろに隠す */
    hide() {
        this.cancel();
        this.follow = true;
    }

    cancel() {
        clearTimeout(this.#timer);
        this.gauge.stop();
    }
}

/**
 * HPバー：HPを持ち、ゲージ（と残像）を動かす
 */
export class HpBar {
    hp = $state(0);

    /**
     * @param {object} options
     * @param {import('./Character.svelte.js').Character} options.character キャラクター（名前・レベル・最大HP）
     * @param {import('./GaugeColors.svelte.js').GaugeColors} options.colors ゲージの色
     * @param {import('./motions.svelte.js').Motion} options.motion 減り方
     * @param {boolean} [options.trail] 残像を出すか
     * @param {number} [options.trailDelay] 残像が追いかけ始めるまでの時間（ms）
     */
    constructor({ character, colors, motion, trail = false, trailDelay = 400 }) {
        this.character = character;
        this.colors = colors;
        this.motion = motion;
        const max = character.safeMaxHp;
        this.hp = max;
        this.gauge = new Gauge(max, max, motion);
        this.trail = trail ? new Trail(new Gauge(max, max, motion), trailDelay) : null;
    }

    get name() {
        return this.character.name;
    }

    get level() {
        return this.character.level;
    }

    get max() {
        return this.character.safeMaxHp;
    }

    /** 最大HPが変わったときなどに、HPを満タンに戻す */
    reset() {
        this.dispose();
        const max = this.max;
        this.hp = max;
        this.gauge.max = max;
        this.gauge.jumpTo(max);
        if (this.trail) {
            this.trail.gauge.max = max;
            this.trail.gauge.jumpTo(max);
            this.trail.follow = false;
        }
    }

    /** 見出し（減り方の名前） */
    get title() {
        return this.motion.name + (this.trail ? '＋残像' : '');
    }

    /** 表示中のHP（整数） */
    get shownHp() {
        return Math.ceil(this.gauge.value);
    }

    /** 緑ゲージの割合 0〜1 */
    get ratio() {
        return this.gauge.ratio;
    }

    /** 残像の割合 0〜1 */
    get trailRatio() {
        if (!this.trail) return 0;
        return this.trail.follow ? this.ratio : this.trail.gauge.ratio;
    }

    /** 本体ゲージの色（残りHPの割合で変わる） */
    get fillColor() {
        return this.colors.colorAt(this.ratio);
    }

    /** 残像の色 */
    get trailColor() {
        return this.colors.trail;
    }

    damage(amount) {
        const from = this.gauge.value;
        this.#setHp(this.hp - amount);
        this.trail?.chase(from, this.hp);
    }

    heal(amount) {
        this.trail?.hide();
        this.#setHp(this.hp + amount);
    }

    #setHp(value) {
        this.hp = Math.min(this.max, Math.max(0, value));
        this.gauge.moveTo(this.hp);
    }

    dispose() {
        this.gauge.stop();
        this.trail?.cancel();
    }

    /**
     * amount のダメージを受けたときの「時間 → ダメージ量」のグラフ
     * @returns {{ lines: { kind: 'main' | 'trail', points: number[][] }[], seconds: number, trailSeconds: number }}
     */
    graph(amount) {
        const seconds = this.motion.duration(amount, this.max) / 1000;
        const points = this.motion.graphPoints(amount, this.max);
        if (!this.trail) {
            return { lines: [{ kind: 'main', points }], seconds, trailSeconds: 0 };
        }

        // 残像は本体と同じ点列を delay ぶん右にずらす
        const delay = this.trail.delay / 1000;
        const total = seconds + delay;
        const main = [...points.map(([x, y]) => [(x * seconds) / total, y]), [1, 1]];
        const trail = [[0, 0], ...points.map(([x, y]) => [(delay + x * seconds) / total, y])];
        return {
            lines: [
                { kind: 'trail', points: trail },
                { kind: 'main', points: main },
            ],
            seconds,
            trailSeconds: total,
        };
    }
}
