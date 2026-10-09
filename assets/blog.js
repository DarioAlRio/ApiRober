// Páginas del blog: menú móvil, año y modo claro/oscuro (lo mismo que la portada, sin la intro ni el pedido)
const t = document.querySelector('.nav-toggle'), m = document.getElementById('menu');
t.addEventListener('click', () => {
  const o = t.getAttribute('aria-expanded') === 'true';
  t.setAttribute('aria-expanded', String(!o)); m.classList.toggle('open', !o);
});
document.getElementById('y').textContent = new Date().getFullYear();

const tt = document.querySelector('.theme-toggle'), rootEl = document.documentElement;
const isDark = () => rootEl.dataset.theme ? rootEl.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
const label = () => tt.setAttribute('aria-label', isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
tt.addEventListener('click', () => {
  tt.classList.remove('spin'); void tt.offsetWidth; tt.classList.add('spin');
  rootEl.dataset.theme = isDark() ? 'light' : 'dark';
  try { localStorage.setItem('tema', rootEl.dataset.theme); } catch (e) {}
  label();
});
tt.addEventListener('animationend', () => tt.classList.remove('spin'));
label();

// Barra de lectura: se llena de miel según avanzas en el artículo
const rb = document.querySelector('.read-bar'), post = document.querySelector('.post .wrap');
if (rb && post) {
  const upd = () => { const r = post.getBoundingClientRect(); rb.style.setProperty('--p', Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))); };
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
}
