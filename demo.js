// Scripted homepage chat demo: fictional dialogue, no live AI, no data sent anywhere.
(() => {
  const root = document.querySelector('#demo-chat');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const script = [
    { who: 'customer', text: "I need a process that pulls data from the utility providers for all my tenants, puts those into a Google Sheet, and then emails the tenant their portion of the bill." },
    { who: 'agent', text: "Got it. Quick check first — how many units, how many different utility providers, and how do you get the data today? Portal logins, PDF bills, something else?" },
    { who: 'customer', text: "12 units, 3 utility companies. Right now I log into each portal by hand every month." },
    { who: 'agent', text: "That's the part worth killing. Here's what I'll build: pull each tenant's usage from the three portals on your bill date, split it into a shared Google Sheet by unit, then auto-email each tenant their portion. You'll get a summary first so you can spot-check before anything goes out." },
    { who: 'customer', text: "Can it flag if a bill looks unusually high?" },
    { who: 'agent', text: "Good call — I'll add a threshold check against that tenant's 3-month average, so a spike gets flagged before it ever reaches them." },
    { who: 'agent', text: "Built it against your last three months of bills. Here's the sheet and a sample tenant email — take a look." },
  ];

  function buildLine(who) {
    const wrap = document.createElement('div');
    wrap.className = `chat-line chat-${who}`;
    const label = document.createElement('span');
    label.className = 'chat-label';
    label.textContent = who === 'customer' ? 'Customer' : 'Agent';
    const bubble = document.createElement('p');
    bubble.className = 'chat-bubble';
    wrap.append(label, bubble);
    return wrap;
  }

  function renderFinal() {
    root.replaceChildren();
    script.forEach(line => {
      const wrap = buildLine(line.who);
      wrap.querySelector('.chat-bubble').textContent = line.text;
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
    if (!currentBubble) {
      const wrap = buildLine(line.who);
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
