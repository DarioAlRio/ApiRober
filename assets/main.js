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

// Intro de la portada (una vez por visita): el apicultor saca un cuadro, cae la gota y se queda como gota grande
const art = document.querySelector('.hero-art');
if (art && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let visto = false;
  try { visto = sessionStorage.getItem('intro') === '1'; sessionStorage.setItem('intro', '1'); } catch (e) {}
  if (!visto) {
    art.classList.add('intro');
    setTimeout(() => { art.classList.remove('intro'); art.classList.add('intro-done'); }, 7500);
  }
}

// Pedido por WhatsApp a Roberto: primero un resumen para confirmar
const dlg = document.getElementById('resumen');
let waBody = '';
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const items = [['t250', '250 g', 6], ['t500', '500 g', 9], ['t1000', '1 kg', 16]]
    .filter(([k]) => +f.get(k) > 0).map(([k, t, p]) => ({ n: +f.get(k), t, p }));
  if (!items.length) { alert('Indica al menos un tarro.'); return; }
  const tarros = items.reduce((a, i) => a + i.n, 0);
  waBody = `Hola Roberto, soy ${f.get('nombre')}.\nQuería pedir miel de flores:\n${items.map(i => `- ${i.n} × tarro de ${i.t} (${i.p} €) = ${i.n * i.p} €`).join('\n')}\nTotal: ${total()} €`;
  const lista = document.getElementById('resumenLista');
  lista.replaceChildren(...items.map(i => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${i.n} × tarro de ${i.t}</span><b>${i.n * i.p} €</b>`;
    return li;
  }));
  document.getElementById('resumenTotal').innerHTML = `<span>${tarros} ${tarros === 1 ? 'tarro' : 'tarros'}</span><span>${total()} €</span>`;
  if (dlg.showModal) dlg.showModal(); else if (confirm(`${tarros} tarros · ${total()} € · ¿Confirmar?`)) enviar();
});
const enviar = () => window.open(`https://wa.me/34657882582?text=${encodeURIComponent(waBody)}`, '_blank', 'noopener');
document.getElementById('resumenOk').addEventListener('click', () => {
  dlg.close(); enviar();
  const g = document.getElementById('gracias');
  clearTimeout(g.t); g.classList.remove('out'); g.hidden = false;
  g.t = setTimeout(() => { g.classList.add('out'); g.t = setTimeout(() => { g.hidden = true; }, 400); }, 6000);
});
document.getElementById('resumenEditar').addEventListener('click', () => dlg.close());document.getElementById('y').textContent = new Date().getFullYear();

// Tarros a escala: un clic en el tarro o en +/− cambia la cantidad y el total
const sizes = [...document.querySelectorAll('.size')];
const total = () => sizes.reduce((n, s) => n + (+s.querySelector('input').value || 0) * +s.dataset.price, 0);
sizes.forEach(s => {
  const input = s.querySelector('input');
  const sync = () => { s.classList.toggle('picked', +input.value > 0); document.getElementById('total').textContent = `${total()} €`; };
  const add = d => {
    input.value = Math.max(0, (+input.value || 0) + d); sync();
    s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
  };
  s.querySelector('.jar-btn').addEventListener('click', () => add(1));
  s.querySelector('.plus').addEventListener('click', () => add(1));
  s.querySelector('.minus').addEventListener('click', () => add(-1));
  input.addEventListener('input', sync); sync();
});

// Barra de WhatsApp (móvil) y botón flotante (escritorio): se ocultan al llegar al formulario
const cta = document.querySelector('.mobile-cta'), pedidos = document.getElementById('pedidos');
if (cta && 'IntersectionObserver' in window) {
  const fab = document.querySelector('.wa-fab');
  new IntersectionObserver(([e]) => { cta.classList.toggle('hide', e.isIntersecting); fab && fab.classList.toggle('hide', e.isIntersecting); }, { threshold: .1 }).observe(pedidos);
}

// Abeja del scroll: sale de la colmena (arriba), recorre la línea de puntos y se posa en la flor (abajo)
const sb = document.querySelector('.scroll-bee');
if (sb && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const path = sb.querySelector('.trail path'), trail = sb.querySelector('.trail'), bee = sb.querySelector('.sbee');
  const len = path.getTotalLength();
  let ticking = false, lastY = scrollY;
  const ease = (v) => Math.min(1, Math.max(0, v));
  const move = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    const pt = path.getPointAtLength(p * len);
    const box = sb.getBoundingClientRect(), r = trail.getBoundingClientRect();
    let x = r.left - box.left + pt.x / 80 * r.width - 20;
    let y = r.top - box.top + pt.y / 1000 * r.height - 20;
    let scale = 1, rot = Math.max(-25, Math.min(25, (scrollY - lastY) * .8));
    lastY = scrollY;
    const enter = ease(p / .05);              // 0 = dentro de la colmena, 1 = ya volando
    if (enter < 1) { scale = .25 + .75 * enter; y -= (1 - enter) * 22; rot = 0; }
    const landed = p > .985;
    if (landed) rot = -10;
    sb.classList.toggle('home', enter === 0);
    sb.classList.toggle('landed', landed);
    bee.style.opacity = enter === 0 ? 0 : 1;
    bee.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
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

// Modo claro / oscuro: respeta el del sistema hasta que se pulsa el botón, y lo recuerda
const tt = document.querySelector('.theme-toggle'), rootEl = document.documentElement;
const isDark = () => rootEl.dataset.theme ? rootEl.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
const label = () => tt.setAttribute('aria-label', isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
tt.addEventListener('click', () => {
  rootEl.dataset.theme = isDark() ? 'light' : 'dark';
  try { localStorage.setItem('tema', rootEl.dataset.theme); } catch (e) {}
  label();
});
label();
