// Progressive enhancement: without JS, all stories and illustrations remain available.
(() => {
  const tabs = [...document.querySelectorAll('.work-tab')];
  if (!tabs.length) return;
  const panels = tabs.map(tab => document.querySelector(tab.getAttribute('href')));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tablist = document.querySelector('.work-tabs');
  tablist.setAttribute('role', 'tablist');
  let active = 0;
  const states = panels.map(panel => ({ panel, theater: panel.querySelector('.workflow-theater'), steps: [...panel.querySelectorAll('.scene-step')], step: 0, timer: null, visible: false, started: false, finished: false }));
  function showStep(state, index) {
    state.step = index;
    state.steps.forEach((el, i) => {
      el.classList.toggle('is-current', i === index);
      el.classList.toggle('is-complete', i < index);
      if (i === index) el.querySelector('button').setAttribute('aria-current', 'step');
      else el.querySelector('button').removeAttribute('aria-current');
    });
    state.theater.querySelector('.scene-caption').textContent = `Step ${index + 1} of 4 — ${state.steps[index].dataset.caption}`;
  }
  function stop(state) {
    clearInterval(state.timer); state.timer = null;
    state.theater.classList.remove('is-playing');
    const toggle = state.theater.querySelector('.scene-toggle');
    toggle.textContent = reduced.matches ? 'Static view' : state.finished ? 'Play again' : 'Play';
    toggle.disabled = reduced.matches;
  }
  function play(state) {
    if (reduced.matches || state.panel.hidden || document.hidden || !state.visible) return;
    stop(state);
    if (state.finished) { state.finished = false; showStep(state, 0); }
    state.started = true;
    state.theater.classList.add('is-playing');
    state.theater.querySelector('.scene-toggle').textContent = 'Pause';
    state.timer = setInterval(() => {
      if (state.step === state.steps.length - 1) { state.finished = true; stop(state); }
      else showStep(state, state.step + 1);
    }, 3000);
  }
  function activate(index, focus = false, updateHash = false) {
    states.forEach(stop); active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    if (updateHash) history.pushState(null, '', '#' + panels[index].id);
    // Visibility observer starts the illustration only once it enters view.
  }
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel'); panels[index].tabIndex = 0;
    tab.addEventListener('click', event => { event.preventDefault(); activate(index, false, true); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (event.key === ' ') next = index;
      if (next !== undefined) { event.preventDefault(); activate(next, true, true); }
    });
  });
  states.forEach(state => {
    state.theater.querySelector('.scene-controls').hidden = false;
    showStep(state, 0); stop(state);
    state.steps.forEach((step, index) => step.querySelector('button').addEventListener('click', () => {
      stop(state); state.started = true; state.finished = false; showStep(state, index);
    }));
    state.theater.querySelector('.scene-toggle').addEventListener('click', () => state.timer ? stop(state) : play(state));
    state.theater.querySelector('.scene-replay').addEventListener('click', () => { stop(state); state.finished = false; showStep(state, 0); play(state); });
  });
  const fromHash = () => { const index = panels.findIndex(panel => '#' + panel.id === location.hash); activate(index < 0 ? 0 : index); };
  fromHash();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const state = states.find(s => s.theater === entry.target); state.visible = entry.isIntersecting;
      if (!state.visible) stop(state);
      else if (!state.started && !state.panel.hidden) play(state);
    }), { threshold: 0.15 });
    states.forEach(state => observer.observe(state.theater));
  } else { states.forEach(state => state.visible = true); }
  addEventListener('popstate', fromHash); addEventListener('hashchange', fromHash);
  document.addEventListener('visibilitychange', () => { if (document.hidden) states.forEach(stop); });
  reduced.addEventListener('change', () => states.forEach(stop));
})();
