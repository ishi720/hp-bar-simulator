/**
 * ゲージの色：残りHPの割合に応じて色を切り替える
 * すべてのHPバーで同じインスタンスを共有する
 */
export class GaugeColors {
    high = $state('#3ccf5a'); // 通常
    mid = $state('#f2c32b'); // 注意
    low = $state('#e5484d'); // 危険
    trail = $state('#ff5c6c'); // 残像

    midAt = $state(50); // この%以下で「注意」の色
    lowAt = $state(20); // この%以下で「危険」の色

    constructor(options = {}) {
        Object.assign(this, options);
    }

    /** 入力途中の空欄や範囲外でも壊れないように、0〜100 にそろえた「注意」の境目 */
    get safeMidAt() {
        return clamp(this.midAt);
    }

    /** 「危険」の境目は「注意」の境目を超えないようにする */
    get safeLowAt() {
        return Math.min(clamp(this.lowAt), this.safeMidAt);
    }

    /**
     * 残りHPの割合に応じた色
     * @param {number} ratio 0〜1
     */
    colorAt(ratio) {
        const percent = ratio * 100;
        if (percent > this.safeMidAt) return this.high;
        if (percent > this.safeLowAt) return this.mid;
        return this.low;
    }
}

function clamp(value) {
    return Math.min(100, Math.max(0, Number(value) || 0));
}
