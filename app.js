const questions = [
  {
    prompt: "What task feels the most repetitive or frustrating right now?",
    placeholder: "For example: entering invoice details into two systems...",
    chips: ["Invoice entry", "Moving data", "Sorting documents"],
  },
  {
    prompt: "How often does that happen, and roughly how much team time does it take?",
    placeholder: "For example: about 80 invoices and 10 hours every week...",
    chips: ["Daily", "Several times a week", "A few times a month"],
  },
  {
    prompt: "If we improved it, what would matter most to you?",
    placeholder: "For example: faster turnaround and fewer entry mistakes...",
    chips: ["Save time", "Reduce errors", "Improve cash flow"],
  },
];

const state = { step: 0, answers: [] };

const form = document.querySelector("#advisor-form");
const answer = document.querySelector("#advisor-answer");
const chatLog = document.querySelector("#chat-log");
const chips = document.querySelector("#suggestion-chips");
const counter = document.querySelector("#step-counter");
const progress = document.querySelector("#progress-bar");
const result = document.querySelector("#lead-result");
const restart = document.querySelector("#restart-advisor");
const leadSubmit = document.querySelector("#lead-submit");
const initialChat = chatLog.innerHTML;

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function addMessage(text, type) {
  const element = document.createElement("div");
  element.className = `message message-${type}`;
  if (type === "assistant") {
    element.innerHTML = `<div class="message-avatar">MT</div><div class="message-bubble"><p>${text}</p></div>`;
  } else {
    element.innerHTML = `<div class="message-bubble"><p>${escapeHtml(text)}</p></div>`;
  }
  chatLog.append(element);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function addTyping() {
  const element = document.createElement("div");
  element.id = "typing";
  element.className = "message message-assistant";
  element.innerHTML = '<div class="message-avatar">MT</div><div class="message-bubble"><div class="typing-dots"><i></i><i></i><i></i></div></div>';
  chatLog.append(element);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function updateChips(items) {
  chips.innerHTML = items.map((item) => `<button type="button">${item}</button>`).join("");
  chips.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      answer.value = button.textContent;
      answer.focus();
    });
  });
}

function nextQuestion() {
  const next = questions[state.step - 1];
  document.querySelector("#typing")?.remove();
  addMessage(`<strong>${next.prompt}</strong>`, "assistant");
  answer.placeholder = next.placeholder;
  updateChips(next.chips);
  counter.textContent = `Question ${state.step + 1} of 4`;
  progress.style.width = `${(state.step + 1) * 25}%`;
  answer.focus();
}

function createSnapshot() {
  const all = state.answers.join(" ").toLowerCase();
  let snapshot = {
    title: "Turn that recurring task into a simple assisted workflow",
    summary: "A focused pilot could capture the information once, apply your rules consistently, and keep a person in control for final review.",
    start: "Map one real example from beginning to end",
    value: "Less handling time and fewer dropped steps",
  };

  if (/invoice|billing|receipt|payment|payable/.test(all)) {
    snapshot = {
      title: "A faster path from invoice to approval",
      summary: "AI can read incoming invoices, pull out the fields your team needs, flag anything unusual, and prepare each item for a quick human review.",
      start: "One invoice type and one approval path",
      value: "Faster entry, fewer errors, clearer exceptions",
    };
  } else if (/document|pdf|paper|form|contract|email/.test(all)) {
    snapshot = {
      title: "A smarter intake lane for documents",
      summary: "An assisted workflow can identify each document, summarize what matters, and route it to the right person without asking your team to sort everything by hand.",
      start: "Your highest-volume document category",
      value: "Quicker routing and less manual sorting",
    };
  } else if (/data|copy|paste|spreadsheet|system|entry/.test(all)) {
    snapshot = {
      title: "Enter information once, then let it flow",
      summary: "A lightweight automation can validate routine information and move it between your existing tools, with a clear review step when something does not match.",
      start: "One repeatable handoff between two tools",
      value: "Hours returned and cleaner records",
    };
  } else if (/follow|customer|reply|schedule|status|update/.test(all)) {
    snapshot = {
      title: "Keep follow-ups moving without losing the human touch",
      summary: "AI can organize requests, draft routine updates, and surface the conversations that need personal attention—while your team stays in control of what gets sent.",
      start: "One common request or follow-up sequence",
      value: "Faster responses and fewer missed handoffs",
    };
  }

  document.querySelector("#result-title").textContent = snapshot.title;
  document.querySelector("#result-summary").textContent = snapshot.summary;
  document.querySelector("#result-start").textContent = snapshot.start;
  document.querySelector("#result-value").textContent = snapshot.value;

  chatLog.hidden = true;
  form.hidden = true;
  result.hidden = false;
  counter.textContent = "Snapshot ready";
  progress.style.width = "100%";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = answer.value.trim();
  if (!value) return;

  state.answers.push(value);
  addMessage(value, "user");
  answer.value = "";
  answer.disabled = true;
  addTyping();

  state.step += 1;
  window.setTimeout(() => {
    if (state.step < 4) nextQuestion();
    else {
      document.querySelector("#typing")?.remove();
      addMessage("That gives me enough to suggest a sensible first step.", "assistant");
      window.setTimeout(createSnapshot, 450);
    }
    answer.disabled = false;
  }, 650);
});

restart.addEventListener("click", () => {
  state.step = 0;
  state.answers = [];
  chatLog.innerHTML = initialChat;
  chatLog.hidden = false;
  form.hidden = false;
  result.hidden = true;
  answer.value = "";
  answer.placeholder = "For example: a 12-person property management company...";
  counter.textContent = "Question 1 of 4";
  progress.style.width = "25%";
  updateChips(["Professional services", "Manufacturing", "Retail"]);
  answer.focus();
});

leadSubmit.addEventListener("click", () => {
  const name = document.querySelector("#lead-name");
  const email = document.querySelector("#lead-email");
  if (!name.value.trim() || !email.validity.valid || !email.value.trim()) {
    if (!name.value.trim()) name.focus();
    else email.focus();
    return;
  }
  leadSubmit.textContent = "Preview complete ✓";
  leadSubmit.disabled = true;
  document.querySelector(".preview-note").textContent = "This concept is ready for secure lead delivery to be connected.";
});

updateChips(["Professional services", "Manufacturing", "Retail"]);

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

document.querySelector("#year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
