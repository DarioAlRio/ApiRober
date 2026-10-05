// Menú móvil
const t = document.querySelector('.nav-toggle'), m = document.getElementById('menu');
t.addEventListener('click', () => {
  const o = t.getAttribute('aria-expanded') === 'true';
  t.setAttribute('aria-expanded', String(!o)); m.classList.toggle('open', !o);
});
m.addEventListener('click', e => { if (e.target.closest('a')) { t.setAttribute('aria-expanded', 'false'); m.classList.remove('open'); } });

// Aparición al hacer scroll
const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
document.documentElement.classList.add('js');

// Pedido por correo
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const lineas = [['t250', '250 g'], ['t500', '500 g'], ['t1000', '1 kg']]
    .filter(([k]) => +f.get(k) > 0).map(([k, t]) => `- ${f.get(k)} tarro(s) de ${t}`);
  if (!lineas.length) { alert('Indica al menos un tarro.'); return; }
  const body = `Hola, soy ${f.get('nombre')}.\nQuería pedir miel de flores:\n${lineas.join('\n')}\n¿Qué precio tendría?`;
  location.href = `mailto:info@apirober.es?subject=${encodeURIComponent('Pedido de miel')}&body=${encodeURIComponent(body)}`;
});
document.getElementById('y').textContent = new Date().getFullYear();

// Tarros a escala: un clic en el tarro o en +/− cambia la cantidad
document.querySelectorAll('.size').forEach(s => {
  const input = s.querySelector('input');
  const sync = () => s.classList.toggle('picked', +input.value > 0);
  const add = d => {
    input.value = Math.max(0, (+input.value || 0) + d); sync();
    s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
  };
  s.querySelector('.jar-btn').addEventListener('click', () => add(1));
  s.querySelector('.plus').addEventListener('click', () => add(1));
  s.querySelector('.minus').addEventListener('click', () => add(-1));
  input.addEventListener('input', sync); sync();
});

// Barra de pedido en móvil: se oculta al llegar al formulario
const cta = document.querySelector('.mobile-cta'), pedidos = document.getElementById('pedidos');
if (cta && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => cta.classList.toggle('hide', e.isIntersecting), { threshold: .1 }).observe(pedidos);
}

// Abeja que recorre la línea de puntos según el scroll
const sb = document.querySelector('.scroll-bee');
if (sb && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const path = sb.querySelector('path'), bee = sb.querySelector('img'), svg = sb.querySelector('svg');
  const len = path.getTotalLength();
  let ticking = false, lastY = 0;
  const move = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    sb.classList.toggle('on', scrollY > innerHeight * .6);
    const pt = path.getPointAtLength(p * len);
    const r = svg.getBoundingClientRect();
    const x = pt.x / 80 * r.width - 22, y = pt.y / 1000 * r.height - 22;
    const tilt = Math.max(-20, Math.min(20, (scrollY - lastY) * .6)); lastY = scrollY;
    bee.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg)`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  addEventListener('resize', move); move();
}

// Abeja que sigue el cursor (solo ratón): va con retraso, se orienta hacia donde vuela y revolotea al pararse
const cb = document.querySelector('.cursor-bee');
if (cb && matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let mx = innerWidth / 2, my = innerHeight / 2, x = mx, y = my, ang = 0, t = 0, running = false;
  const loop = () => {
    t += 0.08;
    const dx = mx + 26 - x, dy = my + 22 - y;          // se queda un poco abajo a la derecha del puntero
    x += dx * 0.09; y += dy * 0.09;
    const speed = Math.hypot(dx, dy);
    if (speed > 2) {                                     // la cabeza de la imagen mira arriba-derecha (-45°)
      const target = Math.atan2(dy, dx) * 180 / Math.PI + 45;
      ang += (((target - ang + 540) % 360) - 180) * 0.15; // gira por el camino corto
    }
    const hover = speed < 6 ? Math.sin(t * 2) * 4 : 0;   // revoloteo cuando está quieta
    cb.style.transform = `translate(${x - 20}px, ${y - 20 + hover}px) rotate(${ang}deg)`;
    requestAnimationFrame(loop);
  };
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY; cb.classList.add('on');
    if (!running) { running = true; x = mx; y = my; loop(); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => cb.classList.remove('on'));
}
