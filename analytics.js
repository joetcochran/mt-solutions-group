/* GA4 + Clarity: neither provider loads before opt-in. */
(() => {
  'use strict';
  const ID = 'G-7DQS782PJN';
  const CLARITY = 'yjpn9hzcac';
  const KEY = 'mt-analytics-consent-v2';
  const OWNER = 'mt-analytics-owner-excluded';
  const DAYS = 180;
  const routes = new Set(['/', '/index.html', '/selected-work.html', '/get-started.html']);
  const hosts = new Set(['mtsolutions.group', 'www.mtsolutions.group']);
  if (!hosts.has(location.hostname) || (!routes.has(location.pathname) && location.pathname !== '/privacy.html')) return;
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Session-only when storage is unavailable. */ } };
  const choice = () => {
    try { const v = JSON.parse(read(KEY)); return v && Date.now() - v.time < DAYS * 86400000 && ['accepted', 'declined'].includes(v.choice) ? v.choice : null; } catch { return null; }
  };
  const query = new URLSearchParams(location.search);
  if (query.get('analytics') === 'off') save(OWNER, 'true');
  if (query.get('analytics') === 'on') { try { localStorage.removeItem(OWNER); } catch {} }
  const excluded = () => read(OWNER) === 'true' || navigator.globalPrivacyControl === true;
  let accepted = false;
  let started = false;
  let clarityLoaded = false;
  let clarityStopped = false;
  let previousFocus;
  window['ga-disable-' + ID] = true;
  const safeReferrer = () => {
    try {
      const u = new URL(document.referrer);
      if (!['https:', 'http:'].includes(u.protocol)) return '';
      if (hosts.has(u.hostname)) return routes.has(u.pathname) ? u.origin + u.pathname : '';
      return u.origin + '/';
    } catch { return ''; }
  };
  const titles = { '/selected-work.html': 'Selected Work | MT Solutions Group', '/get-started.html': '30-Day Risk-Free AI Trial | MT Solutions Group' };
  const page = {
    page_location: location.origin + location.pathname,
    page_referrer: safeReferrer(),
    page_title: titles[location.pathname] || 'MT Solutions Group'
  };
  function startClarity() {
    // Clarity observes the actual URL. Exclude query-bearing visits and private referrers.
    if (location.search || (location.hash && !/^#(top|what-we-fix|selected-work|fork|first-engagement|how-it-works|about|fleet-citations|field-services|multi-currency)$/.test(location.hash))) return;
    try { const ref = new URL(document.referrer); if (ref.search || (hosts.has(ref.hostname) && !routes.has(ref.pathname))) return; } catch {}
    if (clarityLoaded) {
      if (clarityStopped) { window.clarity('start'); clarityStopped = false; }
      window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
      return;
    }
    clarityLoaded = true;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://www.clarity.ms/tag/' + CLARITY;
    script.referrerPolicy = 'no-referrer';
    document.head.append(script);
  }
  function start() {
    if (!accepted || excluded() || !routes.has(location.pathname)) return;
    window['ga-disable-' + ID] = false;
    startClarity();
    if (started) { window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    const config = { ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: 'mtsolutions.group', cookie_expires: DAYS * 86400, cookie_update: false };
    // Keep only simple campaign labels. Never forward arbitrary URL queries, hashes or mailto URLs.
    for (const part of ['source', 'medium', 'name']) {
      const value = query.get(part === 'name' ? 'utm_campaign' : 'utm_' + part);
      if (value && /^[a-zA-Z0-9_-]{1,64}$/.test(value)) config['campaign_' + part] = value;
    }
    window.gtag('config', ID, config);
    window.gtag('event', 'page_view', { ...page, send_to: ID });
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    script.referrerPolicy = 'no-referrer';
    document.head.append(script);
  }
  function stop() {
    accepted = false;
    // Google's supported opt-out flag blocks subsequent collection from this page.
    window['ga-disable-' + ID] = true;
    if (clarityLoaded && !clarityStopped) {
      window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
      window.clarity('stop');
      clarityStopped = true;
    }
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!['_ga', '_ga_7DQS782PJN', '_clck', '_clsk'].includes(name)) continue;
      for (const domain of ['', '; domain=mtsolutions.group', '; domain=www.mtsolutions.group']) {
        document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax; Secure';
      }
    }
  }
  // A narrow event API: all values are fixed labels, never user-entered text.
  const simple = new Set(['linkedin_click']);
  const cases = new Set(['fleet-citations', 'field-services', 'multi-currency']);
  window.mtAnalytics = (event, label) => {
    if (!accepted || excluded() || !started) return;
    const params = { ...page, send_to: ID };
    if (event === 'case_select' && cases.has(label)) params.case_id = label;
    else if (event === 'contact_click' && ['case_study', 'footer', 'page'].includes(label)) params.placement = label;
    else if (!simple.has(event)) return;
    window.gtag('event', event, params);
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a'); if (!link) return;
    if (link.protocol === 'mailto:') window.mtAnalytics('contact_click', link.closest('.case-study') ? 'case_study' : link.closest('footer') ? 'footer' : 'page');
    else if (link.hostname === 'www.linkedin.com') window.mtAnalytics('linkedin_click');
  });
  const panel = document.createElement('section');
  panel.className = 'analytics-choice'; panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'analytics-choice-title');
  panel.innerHTML = '<h2 id="analytics-choice-title">May we measure what’s useful?</h2><p>Optional Google Analytics and Microsoft Clarity use cookies to measure visits, clicks and scrolling. Clarity provides heatmaps and session replays, with get-started page answers masked. The site works either way. <a href="privacy.html">Privacy details</a></p><p class="analytics-current" role="status"></p><div class="analytics-actions"><button type="button" data-choice="accepted">Allow analytics</button><button type="button" data-choice="declined">No thanks</button><button type="button" data-close hidden>Close</button></div>';
  document.body.append(panel);
  const buttons = [...document.querySelectorAll('[data-analytics-settings]')];
  function show(focus) {
    previousFocus = focus ? document.activeElement : null;
    panel.hidden = false;
    panel.querySelector('.analytics-current').textContent = excluded() ? 'Analytics is excluded in this browser.' : accepted ? 'Your current choice: analytics allowed.' : 'Analytics is currently off.';
    panel.querySelector('[data-choice="accepted"]').disabled = excluded();
    panel.querySelector('[data-close]').hidden = !choice();
    if (focus) panel.querySelector(excluded() ? '[data-choice="declined"]' : '[data-choice="accepted"]').focus();
  }
  const close = () => { panel.hidden = true; previousFocus?.focus(); };
  panel.querySelector('[data-close]').addEventListener('click', close);
  panel.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    save(KEY, JSON.stringify({ choice: button.dataset.choice, time: Date.now() }));
    accepted = button.dataset.choice === 'accepted' && !excluded();
    if (accepted) start(); else stop();
    close();
  }));
  buttons.forEach(button => { button.hidden = false; button.addEventListener('click', () => show(true)); });
  accepted = choice() === 'accepted' && !excluded();
  if (accepted) start();
  else { stop(); if (!choice() && !excluded()) show(false); }
  addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== OWNER && event.key !== null) return;
    accepted = choice() === 'accepted' && !excluded();
    if (accepted) start(); else stop();
    if (!panel.hidden) show(false);
  });
})();
