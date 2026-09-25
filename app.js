// Shared navigation and footer year across all pages.
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
// Dogfooding proof tooltip: hover works via CSS; this adds tap support for touch devices.
const proofTrigger = document.querySelector('.proof-trigger');
const proofTooltip = document.querySelector('.proof-tooltip');
if (proofTrigger && proofTooltip) {
  proofTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    proofTooltip.classList.toggle('is-open');
  });
  document.addEventListener('click', (event) => {
    if (!proofTooltip.contains(event.target) && event.target !== proofTrigger) {
      proofTooltip.classList.remove('is-open');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') proofTooltip.classList.remove('is-open');
  });
}
// Keep content accessible without animation support or JavaScript.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
}

