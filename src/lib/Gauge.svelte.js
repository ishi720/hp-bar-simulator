/**
 * ゲージ：表示中の値（value）を、Motion に従って目標の値まで動かす
 */
export class Gauge {
    value = $state(0);
    max = $state(1);
    #stop = () => {};

    /**
     * @param {number} value 初期値
     * @param {number} max   最大値
     * @param {import('./motions.svelte.js').Motion} motion 動き方
     */
    constructor(value, max, motion) {
        this.value = value;
        this.max = max;
        this.motion = motion;
    }

    /** 0〜1 の割合 */
    get ratio() {
        return this.value / this.max;
    }

    /** 目標の値まで動かす */
    moveTo(to) {
        this.#stop();
        this.#stop = this.motion.run(this.value, to, this.max, (v) => (this.value = v));
    }

    /** アニメーションなしで値を変える */
    jumpTo(value) {
        this.#stop();
        this.value = value;
    }

    stop() {
        this.#stop();
    }
}
