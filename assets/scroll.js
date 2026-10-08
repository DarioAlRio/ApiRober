// Scroll suave con inercia (Lenis). Se desactiva si el sistema pide reducir animaciones
if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = window.lenis = new Lenis({ lerp: .09, wheelMultiplier: .9, prevent: n => n.closest && n.closest('dialog') });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // Enlaces internos (#pedidos, #top…): desplazamiento suave teniendo en cuenta la barra fija de arriba
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
    const el = a.hash === '#top' ? 0 : document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (el === null) return;
    e.preventDefault();
    const nav = document.querySelector('.nav');
    lenis.scrollTo(el, { offset: el === 0 ? 0 : -(nav ? nav.offsetHeight : 0), duration: 1.2 });
    history.pushState(null, '', a.hash);
  });

  // Con el resumen del pedido abierto, la página no se mueve
  const dlg = document.querySelector('dialog');
  if (dlg) new MutationObserver(() => dlg.open ? lenis.stop() : lenis.start()).observe(dlg, { attributes: true, attributeFilter: ['open'] });
}
