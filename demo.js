// Scripted homepage chat demo: fictional dialogue, no live AI, no data sent anywhere.
(() => {
  const root = document.querySelector('#demo-chat');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const sheetIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="32" height="32" rx="4"/><path d="M8 20h32M8 32h32M20 8v32"/></svg>';

  const script = [
    { who: 'customer', text: "I need a process that pulls data from the utility providers for all my tenants, puts those into a Google Sheet, and then emails the tenant their portion of the bill." },
    { who: 'agent', text: "Got it. Quick check first — how many units, how many different utility providers, and how do you get the data today? Portal logins, PDF bills, something else?" },
    { who: 'customer', text: "12 units, 3 utility companies. Right now I log into each portal by hand every month." },
    { who: 'agent', text: "That's the part worth killing. Here's what I'll build: pull each tenant's usage from the three portals on your bill date, split it into a shared Google Sheet by unit, then auto-email each tenant their portion. You'll get a summary first so you can spot-check before anything goes out." },
    { who: 'customer', text: "Can it flag if a bill looks unusually high?" },
    { who: 'agent', text: "Good call — I'll add a threshold check against that tenant's 3-month average, so a spike gets flagged before it ever reaches them." },
    { who: 'agent', text: "Built it against your last three months of bills. Here's the sheet and a sample tenant email — take a look." },
    { who: 'agent', type: 'attachment', name: 'Tenant Utility Split.gsheet', meta: 'Google Sheet · 12 tenants · Delivered' },
    { who: 'customer', text: "This is great — next, could we get a phone app where I can forward each tenant's bill straight to the email I've got on file for them, and they can pay their share right from a Venmo link?" },
    { who: 'agent', text: "Two quick things before I scope that: do you want it hosted on the environment we already have running for you, or somewhere else? And should the Venmo link point to one account for the whole property, or a separate one per building?" },
  ];

  function buildLine(line) {
    const wrap = document.createElement('div');
    wrap.className = `chat-line chat-${line.who}`;
    const label = document.createElement('span');
    label.className = 'chat-label';
    label.textContent = line.who === 'customer' ? 'Customer' : 'Agent';
    wrap.append(label);
    if (line.type === 'attachment') {
      const card = document.createElement('div');
      card.className = 'chat-attachment';
      card.innerHTML = `<span class="attachment-icon">${sheetIcon}</span><span class="attachment-text"><b>${line.name}</b><small>${line.meta}</small></span>`;
      wrap.append(card);
    } else {
      const bubble = document.createElement('p');
      bubble.className = 'chat-bubble';
      wrap.append(bubble);
    }
    return wrap;
  }

  function renderFinal() {
    root.replaceChildren();
    script.forEach(line => {
      const wrap = buildLine(line);
      if (line.type !== 'attachment') wrap.querySelector('.chat-bubble').textContent = line.text;
      root.append(wrap);
    });
  }

  if (reduced.matches) { renderFinal(); return; }

  let visible = false;
  let timer = null;
  let lineIndex = 0;
  let charIndex = 0;
  let currentBubble = null;

  function reset() {
    root.replaceChildren();
    lineIndex = 0;
    charIndex = 0;
    currentBubble = null;
  }

  function step() {
    timer = null;
    if (reduced.matches) { renderFinal(); return; }
    if (!visible || document.hidden) return; // paused; resume() restarts once conditions allow
    if (lineIndex >= script.length) {
      timer = setTimeout(() => { reset(); step(); }, 4500);
      return;
    }
    const line = script[lineIndex];
    if (line.type === 'attachment') {
      const wrap = buildLine(line);
      root.append(wrap);
      root.scrollTop = root.scrollHeight;
      requestAnimationFrame(() => wrap.querySelector('.chat-attachment').classList.add('is-appearing'));
      lineIndex++;
      timer = setTimeout(step, 1100);
      return;
    }
    if (!currentBubble) {
      const wrap = buildLine(line);
      root.append(wrap);
      currentBubble = wrap.querySelector('.chat-bubble');
      currentBubble.classList.add('is-typing');
      charIndex = 0;
    }
    charIndex++;
    currentBubble.textContent = line.text.slice(0, charIndex);
    root.scrollTop = root.scrollHeight;
    if (charIndex >= line.text.length) {
      currentBubble.classList.remove('is-typing');
      lineIndex++;
      currentBubble = null;
      timer = setTimeout(step, 700);
    } else {
      timer = setTimeout(step, line.who === 'customer' ? 24 : 12);
    }
  }

  function resume() {
    if (!timer && visible && !document.hidden && !reduced.matches) step();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      visible = entry.isIntersecting;
      resume();
    }), { threshold: 0.3 });
    observer.observe(root.closest('.demo-window'));
  } else {
    visible = true;
    step();
  }
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', () => {
    if (reduced.matches) { clearTimeout(timer); timer = null; renderFinal(); }
  });
})();
