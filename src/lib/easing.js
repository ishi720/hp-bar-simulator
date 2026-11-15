// 二次ベジェ曲線：始点(0,0)・制御点(px,py)・終点(1,1)
// 時間 t（0〜1）に対する進み具合 y（0〜1）を返す
export function quadBezier(t, px, py) {
    // x(s) = 2s(1-s)px + s² = t を s について解く（二次方程式）
    const a = 1 - 2 * px;
    const b = 2 * px;
    const s = Math.abs(a) < 1e-6 ? t / b : (-b + Math.sqrt(b * b + 4 * a * t)) / (2 * a);
    return 2 * s * (1 - s) * py + s * s;
}
