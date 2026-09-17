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

## Analytics

`analytics.js` uses GA4 `G-7DQS782PJN` on the production homepage and selected-work page only. `privacy.html` provides preferences without tracking itself. Unlisted drafts and non-production hosts are excluded.

**Before deploying this integration:** turn Enhanced measurement OFF in GA4 Admin → Data streams → MT web stream. The Google-served tag still advertised automatic measurement during initial setup. Keep automatic form/outbound collection off: the worksheet's mailto link includes the user's brief. Custom events deliberately never include link URLs or user text.

- Basic consent: the Google tag is not requested until opt-in. No tracking requests are made after rejection; the site remains usable.
- Footer Analytics preferences permits withdrawal. The Google disable flag stops collection; accessible GA cookies are removed. Preferences and cookies expire after 180 days.
- Events: `contact_click` (fixed placement), `linkedin_click`, `case_select` (known case ID), `brief_start`, `brief_complete`, successful `brief_copy`, and initiated `brief_download`.
- Email clicks indicate intent, not email delivery, leads, or purchases. Mark selected events as key events in GA4 if desired; no dashboard-side configuration is implied by this code.
- Advertiser signals and ad personalization are disabled; Clarity is not installed.
- Owner/test exclusion: visit `https://mtsolutions.group/?analytics=off` in each browser. `?analytics=on` clears that exclusion but does not bypass consent. Global Privacy Control also prevents tracking.
- Page URLs exclude queries/hashes; external referrers retain origin only; private internal referrer paths are dropped. Only simple alphanumeric/hyphen/underscore UTM source, medium and campaign labels are passed.
- Browser checks covered rejection/reload, acceptance, withdrawal and cookie cleanup, preview/privacy/owner exclusion, mobile layout, mouse/keyboard case selection, worksheet event counts, failed clipboard operations, and no answer/query sentinel in event payloads. Real Google tag collection was intercepted locally (no synthetic visits sent), verifying pageview and custom-event request construction. GA4 dashboard receipt still requires a live consenting visit and dashboard verification.
