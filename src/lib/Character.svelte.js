/**
 * キャラクター：名前・レベル・最大HP
 * すべてのHPバーで同じインスタンスを共有する
 */
export class Character {
    name = $state('');
    level = $state(1);
    maxHp = $state(1);

    constructor({ name = '桃太郎', level = 100, maxHp = 1000 } = {}) {
        this.name = name;
        this.level = level;
        this.maxHp = maxHp;
    }

    /** 入力途中の空欄や0でも壊れないように、1以上の整数にそろえた最大HP */
    get safeMaxHp() {
        return Math.max(1, Math.floor(Number(this.maxHp)) || 1);
    }
}
