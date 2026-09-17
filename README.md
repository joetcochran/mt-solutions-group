# MT Solutions Group

Static brochure site for Joe Cochran's practical software and AI consulting, published on GitHub Pages at https://mtsolutions.group/.

## Pages and behavior

- `index.html`: positioning, scoped first engagement (up to 12 hours of Joe's time at no charge), selected-work previews, bio, and direct contact.
- `selected-work.html` and `work.js`: accessible tabs with four-step SVG/CSS workflow illustrations, pause/replay controls, keyboard navigation, deep links, reduced-motion support, and expandable stories covering three systems Joe built in previous roles. Client identities and proprietary artifacts are omitted; workflow illustrations are labeled, with no invented results.
- `app.js`: shared navigation and a four-question, local-only guided worksheet. It is not an AI chat or a feasibility assessment.
- The worksheet uses the task, tools, frequency/effort, and goal/review requirements in a shareable brief. It offers clipboard copy, text download, and an explicitly labeled email-draft handoff.
- No form data is submitted to a server, no email is sent automatically, and no responses are persisted after refresh. A user must send the email draft themselves. Copy/download are alternatives when no mail client is configured.
- Real AI analysis and server-side lead delivery remain future work. The selected-work visuals are illustrative, not working client-system demos.

## Local preview

```sh
python3 -m http.server 8766
```

Open http://localhost:8766/. No framework or build step is required. Validate JavaScript with `node --check app.js` and review both pages on mobile and desktop before pushing to `main`.

Never put model API keys, SMTP credentials, or client data in this public repository.
