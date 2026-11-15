import { quadBezier } from './easing.js';

/**
 * 減り方（Strategy）の基底クラス
 *
 * サブクラスは次の2つを実装するだけで、アニメーションとグラフの両方に使える
 * - duration(amount, max)    : amount だけ動くのにかかる時間（ms）
 * - progress(t, amount, max) : 開始から t ms 経ったときの進み具合（0〜1）
 */
export class Motion {
    /** 見出しに出す名前 */
    get name() {
        return '';
    }

    duration(amount, max) {
        return 0;
    }

    progress(t, amount, max) {
        return 1;
    }

    /** 動いている途中で設定を変えても影響しないように、設定を固定したコピーを返す */
    clone() {
        return this;
    }

    /**
     * from から to まで動かす。値が変わるたびに onUpdate(value) を呼ぶ
     * @returns {() => void} 途中で止める関数
     */
    run(from, to, max, onUpdate) {
        const amount = Math.abs(to - from);
        const motion = this.clone();
        const total = motion.duration(amount, max);
        if (total <= 0) {
            onUpdate(to);
            return () => {};
        }

        const start = performance.now();
        let rafId = 0;
        const tick = (now) => {
            const t = Math.min(now - start, total);
            onUpdate(from + (to - from) * motion.progress(t, amount, max));
            if (t < total) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }

    /** グラフ用の点列（横：時間 0〜1、縦：進み具合 0〜1） */
    graphPoints(amount, max, samples = 60) {
        const total = this.duration(amount, max);
        if (total <= 0) return [[0, 0], [0, 1], [1, 1]];
        return Array.from({ length: samples + 1 }, (_, i) => [
            i / samples,
            this.progress((total * i) / samples, amount, max),
        ]);
    }
}

/** 一瞬で減る */
export class InstantMotion extends Motion {
    get name() {
        return '一瞬で減る';
    }
}

/** 段階的に減る（msPerStep ごとに stepHp ずつ） */
export class StepMotion extends Motion {
    stepHp = $state(1);    // 一度に減る数
    msPerStep = $state(8); // 何msごとに減るか

    constructor({ stepHp = 1, msPerStep = 8 } = {}) {
        super();
        this.stepHp = stepHp;
        this.msPerStep = msPerStep;
    }

    get name() {
        return '段階的に減る';
    }

    /** 1秒あたりに減るHP（表示用） */
    get hpPerSecond() {
        return Math.round((1000 / this.msPerStep) * this.stepHp);
    }

    duration(amount) {
        return Math.ceil(amount / this.stepHp) * this.msPerStep;
    }

    progress(t, amount) {
        if (amount === 0) return 1;
        const count = Math.floor(t / this.msPerStep);
        return Math.min(count * this.stepHp, amount) / amount;
    }

    clone() {
        return new StepMotion({ stepHp: this.stepHp, msPerStep: this.msPerStep });
    }

    /** 階段がきれいに出るように、段ごとに点を打つ */
    graphPoints(amount) {
        const n = Math.ceil(amount / this.stepHp);
        const pts = [[0, 0]];
        for (let i = 1; i <= n; i++) {
            const x = i / n;
            pts.push([x, pts[pts.length - 1][1]], [x, Math.min(i * this.stepHp, amount) / amount]);
        }
        return pts;
    }
}

/** 二次ベジェ曲線に沿って動く（制御点(0.5, 0)で t² の加速） */
export class CurveMotion extends Motion {
    fullMs = $state(2000); // バー1本ぶん動くのにかかる時間（ms）
    px = $state(0.5);      // 制御点
    py = $state(0);

    constructor({ fullMs = 2000, px = 0.5, py = 0 } = {}) {
        super();
        this.fullMs = fullMs;
        this.px = px;
        this.py = py;
    }

    get name() {
        return '曲線に沿って減る';
    }

    duration(amount, max) {
        return (amount / max) * this.fullMs;
    }

    progress(t, amount, max) {
        return quadBezier(t / this.duration(amount, max), this.px, this.py);
    }

    clone() {
        return new CurveMotion({ fullMs: this.fullMs, px: this.px, py: this.py });
    }
}

/** 一定の速さで減る（毎秒 最大HP × speed） */
export class LinearMotion extends Motion {
    speed = $state(4);

    constructor({ speed = 4 } = {}) {
        super();
        this.speed = speed;
    }

    get name() {
        return '一定の速さで減る';
    }

    duration(amount, max) {
        return (amount / (this.speed * max)) * 1000;
    }

    progress(t, amount, max) {
        return t / this.duration(amount, max);
    }

    clone() {
        return new LinearMotion({ speed: this.speed });
    }
}

/**
 * バウンドして減る
 * ボールを落としたときのように、目標の値に着いたあと何度か跳ね返って止まる
 */
export class BounceMotion extends Motion {
    fullMs = $state(1500);    // バー1本ぶんにかかる時間（バウンドを含む）
    bounces = $state(1);      // バウンド回数
    restitution = $state(0.4); // 跳ね返りの強さ（0〜1。大きいほど高く跳ねる）

    constructor({ fullMs = 1500, bounces = 1, restitution = 0.4 } = {}) {
        super();
        this.fullMs = fullMs;
        this.bounces = bounces;
        this.restitution = restitution;
    }

    get name() {
        return 'バウンドして減る';
    }

    duration(amount, max) {
        return (amount / max) * this.fullMs;
    }

    /**
     * 落下（1区間）＋バウンド（bounces区間）の時間配分を物理的に決める
     * 落下にかかる時間を1とすると、k回目のバウンドは 2e^k かかり、高さは e^(2k) になる
     */
    progress(t, amount, max) {
        const e = this.restitution;
        const total = 1 + Array.from({ length: this.bounces }, (_, i) => 2 * e ** (i + 1)).reduce((a, b) => a + b, 0);
        let u = (t / this.duration(amount, max)) * total; // 落下時間を1とした単位の経過時間

        if (u <= 1) return u * u; // 落下：だんだん速くなる
        u -= 1;
        for (let k = 1; k <= this.bounces; k++) {
            const half = e ** k; // 跳ね上がって頂点に着くまでの時間
            if (u <= 2 * half) {
                const height = half * half - (u - half) ** 2; // 目標からの跳ね返りの高さ
                return 1 - height;
            }
            u -= 2 * half;
        }
        return 1;
    }

    clone() {
        return new BounceMotion({ fullMs: this.fullMs, bounces: this.bounces, restitution: this.restitution });
    }

    graphPoints(amount, max) {
        return super.graphPoints(amount, max, 240); // 細かい跳ね返りが出るように点を多めに
    }
}
