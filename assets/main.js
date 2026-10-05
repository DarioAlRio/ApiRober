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
