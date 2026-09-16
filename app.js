// Shared navigation works on both pages, including when no worksheet is present.
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
// Keep content accessible without animation support or JavaScript.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
}

const form = document.querySelector('#advisor-form');
if (form) setupWorksheet();

function setupWorksheet() {
  const questions = [
    { prompt: 'What task is frustrating you, and what kind of team do you work with?', placeholder: 'For example: our field-service team checks every job description and timecode by hand...', chips: ['Checking job reports', 'Entering invoices', 'Copying spreadsheet data'] },
    { prompt: 'Which tools or records do you use, and where does the information move?', placeholder: 'For example: email attachments → Excel → our accounting system...', chips: ['Email and spreadsheets', 'Paper forms and a business system', 'Two disconnected systems'] },
    { prompt: 'How often does this happen, and roughly how much team time does it take?', placeholder: 'For example: 200 items a month, about 10 minutes each. “Not sure” is fine.', chips: ['Daily; time not measured yet', 'Several times a week', 'Occasionally'] },
    { prompt: 'What would a better result look like—and what must a person still check?', placeholder: 'For example: less retyping, but a manager must approve every payment...', chips: ['Less rework; final human approval', 'Faster replies; review before sending', 'More accurate records'] },
  ];
  const answers = [];
  const input = document.querySelector('#advisor-answer');
  const chat = document.querySelector('#chat-log');
  const initialChat = chat.innerHTML;
  const chips = document.querySelector('#suggestion-chips');
  const result = document.querySelector('#lead-result');
  const title = document.querySelector('#result-title');
  const status = document.querySelector('#brief-status');
  let brief = '';

  function showQuestion() {
    const q = questions[answers.length];
    input.placeholder = q.placeholder;
    chips.replaceChildren();
    q.chips.forEach(text => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = text;
      button.addEventListener('click', () => { input.value = text; input.focus(); });
      chips.append(button);
    });
    document.querySelector('#step-counter').textContent = `Question ${answers.length + 1} of 4`;
    document.querySelector('#progress-bar').style.width = `${(answers.length + 1) * 25}%`;
  }
  function message(text, user) {
    const el = document.createElement('div');
    el.className = `message message-${user ? 'user' : 'assistant'}`;
    const bubble = document.createElement('div'); bubble.className = 'message-bubble';
    bubble.textContent = text; el.append(bubble); chat.append(el); chat.scrollTop = chat.scrollHeight;
  }
  function finish() {
    const task = answers[0].toLowerCase();
    let idea = 'Map one handoff and check whether a simpler process or a rules-based automation would remove repeated effort before considering AI.';
    let review = 'Keep a person responsible for reviewing exceptions and approving consequential actions.';
    let constraint = 'Confirm that there is a repeatable process and accessible, reliable information to work with.';
    let measure = 'Measure handling time, rework, and the number of items that need human intervention.';
    if (/invoice|citation|ticket|receipt|paper|document|pdf/.test(task)) {
      idea = 'Try one document type: extract the needed fields, match them to an existing record, and prepare a review queue. Evaluate OCR or AI extraction only where the format requires it.';
      review = 'A person reviews uncertain extraction or record matches and approves payments or other consequential actions.';
      constraint = 'Check document quality, access permissions, and whether records can be matched reliably. Start with approved, non-sensitive samples.';
      measure = 'Compare time per document and correction rates with the current process; count exceptions rather than assuming everything can be automated.';
    } else if (/timecode|job report|job coding|technician|field.service|quality|qc/.test(task)) {
      idea = 'Compare a small set of new job descriptions and timecodes with previously approved combinations, showing possible mismatches before submission.';
      review = 'The technician or reviewer makes the final choice. Similar historical work is a clue, not proof that a code is correct.';
      constraint = 'Check historical data quality and coverage of unusual or new job types before relying on similarity matching.';
      measure = 'Track useful flags, false alarms, review time, and how often submitted work needs correction.';
    } else if (/copy|spreadsheet|data|retyp|entry|system/.test(task)) {
      idea = 'Choose one repeated transfer between tools. Test field mapping and validation first; a straightforward integration may be sufficient without AI.';
      constraint = 'Confirm access to both systems, consistent identifiers, and a way to review failed or duplicate transfers.';
    } else if (/follow|reply|customer|request|email/.test(task)) {
      idea = 'Try organizing one type of incoming request and preparing a draft response for a person to review. Keep automatic sending out of the initial pilot.';
      review = 'A person checks recipients, facts, and tone before sending a response.';
      constraint = 'Agree what information can be used and identify requests that should always go straight to a person.';
      measure = 'Measure response preparation time, edits required, and missed follow-ups.';
    }
    const fields = [
      ['The task you described', answers[0]], ['Tools and handoffs', answers[1]],
      ['Frequency and current effort', answers[2]], ['Your goal and review requirements', answers[3]],
      ['A possible first step', idea], ['Where a person stays involved', review],
      ['What we need to check', constraint], ['What we would measure', measure],
      ['Is it worth a pilot?', 'Not established yet. Compare the recurring burden you described with setup, review, and maintenance effort. For occasional work, a simpler process may be the better answer.'],
    ];
    document.querySelector('#result-summary').textContent = 'Your task, your tools, and a starting point to discuss—not a commitment to buy or build anything.';
    const details = document.querySelector('#brief-details'); details.replaceChildren();
    fields.forEach(([label, text]) => {
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = text;
      details.append(dt, dd);
    });
    brief = 'An improvement worth discussing\nMT Solutions Group\n\n' + fields.map(([label, text]) => `${label}\n${text}`).join('\n\n') + '\n\nSuggested next step: discuss one scoped pilot with Joe Cochran. The first small engagement includes up to 12 hours of Joe’s time at no charge. Additional work and any third-party costs are agreed beforehand.\n\nThis guided worksheet is not a feasibility assessment or a promise of savings.\njoe@mtsolutions.group\nhttps://mtsolutions.group/';
    document.querySelector('#email-brief').href = `mailto:joe@mtsolutions.group?subject=${encodeURIComponent('Let’s discuss this workflow')}&body=${encodeURIComponent(brief)}`;
    chat.hidden = true; form.hidden = true; result.hidden = false;
    document.querySelector('#step-counter').textContent = 'Brief ready';
    document.querySelector('#progress-bar').style.width = '100%'; title.focus();
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (answers.length >= questions.length) return;
    const value = input.value.trim(); if (!value) return;
    answers.push(value); message(value, true); input.value = '';
    if (answers.length === questions.length) finish();
    else { message(questions[answers.length].prompt, false); showQuestion(); input.focus(); }
  });
  document.querySelector('#restart-advisor').addEventListener('click', () => {
    answers.length = 0; brief = ''; status.textContent = '';
    document.querySelector('#email-brief').href = 'mailto:joe@mtsolutions.group';
    chat.innerHTML = initialChat; chat.hidden = false; form.hidden = false; result.hidden = true;
    input.value = ''; showQuestion(); input.focus();
  });
  document.querySelector('#copy-brief').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(brief); status.textContent = 'Brief copied. Paste it into a message to your manager or an email to Joe.'; }
    catch { status.textContent = 'Copy is unavailable in this browser. Use Download brief to save a text version.'; }
  });
  document.querySelector('#download-brief').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'my-workflow-brief.txt';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Download requested. You can share the text file with your manager or Joe.';
  });
  showQuestion();
}
