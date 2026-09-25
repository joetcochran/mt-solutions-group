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
// Hover tooltips: CSS handles hover; this adds tap support for touch devices.
function wireTapTooltip(trigger, tooltip) {
  if (!trigger || !tooltip) return;
  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    tooltip.classList.toggle('is-open');
  });
  document.addEventListener('click', (event) => {
    if (!tooltip.contains(event.target) && event.target !== trigger) {
      tooltip.classList.remove('is-open');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') tooltip.classList.remove('is-open');
  });
}
wireTapTooltip(document.querySelector('.proof-trigger'), document.querySelector('.proof-tooltip'));
wireTapTooltip(document.querySelector('.engine-chat-trigger'), document.querySelector('.engine-chat-tooltip'));
// Keep content accessible without animation support or JavaScript.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
}

