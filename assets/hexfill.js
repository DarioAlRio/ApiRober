// Celdas rellenas al azar (~5%), nunca dos juntas en los fondos de panal: distintas en cada sección y en cada visita
(() => {
  const T = [['.hero', '#fdb12b', .6, 1], ['#calendario,#origen,#dudas,#pedidos', '#000', .5, 1], ['.post-hero', '#fdb12b', .06, 1], ['.posts .card', '#000', .5, .5]];
  const hex = (x, y) => 'M' + [0, 60, 120, 180, 240, 300].map(a => `${(x + 18.5 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(y + 18.5 * Math.sin(a * Math.PI / 180)).toFixed(1)}`).join(' ') + 'z';
  const run = () => T.forEach(([sel, col, op, k]) => document.querySelectorAll(sel).forEach(el => {
    const w = Math.ceil(el.offsetWidth / k / 60) * 60, h = Math.ceil((el.offsetHeight + 120) / k / 34.641) * 34.641;
    if (el._hf === w + 'x' + h) return; el._hf = w + 'x' + h;
    let d = ''; const on = [];
    for (let x = 20; x < w; x += 30) for (let y = (x - 20) % 60 ? 0 : 17.3205; y < h; y += 34.641) if (Math.random() < .05 && !on.some(([a, b]) => Math.hypot(a - x, b - y) < 40)) { on.push([x, y]); d += hex(x, y); }
    el.style.setProperty('--hexfill', `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h.toFixed(2)}'><path d='${d}' fill='${col}' fill-opacity='${op}'/></svg>`)}")`);
    el.style.setProperty('--hexfill-size', `${w * k}px ${(h * k).toFixed(2)}px`);
  }));
  run(); addEventListener('load', run); addEventListener('resize', run);
})();
