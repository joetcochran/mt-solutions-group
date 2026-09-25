# MT Solutions Group

Static brochure site for Joe Cochran's practical software and AI consulting, published on GitHub Pages at https://mtsolutions.group/.

## Pages and behavior

- `index.html`: positioning, a 30-day risk-free trial as the primary offer, selected-work previews, bio, and direct contact.
- `selected-work.html` and `work.js`: accessible tabs with four-step SVG/CSS workflow illustrations, pause/replay controls, keyboard navigation, deep links, reduced-motion support, and expandable stories covering three systems Joe built in previous roles. Client identities and proprietary artifacts are omitted; workflow illustrations are labeled, with no invented results.
- `get-started.html`: the 30-day trial page. A fork lets a visitor either talk through "I don't know where to start" (a short AI Coach form) or answer a branching questionnaire for "I have a specific pain point," which adapts based on team size, revenue, and where it hurts most. Both end in a brief sent to Joe.
- `app.js`: shared navigation (menu toggle, footer year, scroll-reveal) used by every page.
- Submissions on `get-started.html` (the AI Coach form and the questionnaire) POST directly to Web3Forms, a third-party form-delivery API, using a public site access key embedded in the page; Web3Forms forwards the message to Joe's inbox automatically. If that request fails, the page falls back to opening a `mailto:` draft instead. Either way, the visitor can also copy or download their brief as plain text. No response is persisted in the browser after refresh, and there is no site-side backend or database.
- Real AI analysis remains future work. The selected-work visuals are illustrative, not working client-system demos.

## Local preview

```sh
python3 -m http.server 8766
```

Open http://localhost:8766/. No framework or build step is required. Validate JavaScript with `node --check app.js` and review both pages on mobile and desktop before pushing to `main`.

Never put model API keys, SMTP credentials, or client data in this public repository.

## Email

Outbound/reply email for `mtsolutions.group` is handled by smtp2go, configured entirely at the DNS level (CNAME records) so Joe can send and receive replies from his mtsolutions.group address through his Gmail portal. smtp2go has no code-level integration with this repository — no API calls, no credentials, no site-side interaction.

`get-started.html` is the one page with a real client-side API call: its two forms POST to `https://api.web3forms.com/submit` with a public Web3Forms access key embedded in the page (not a secret; Web3Forms access keys are designed to be client-visible) so a submission reaches Joe's inbox without the visitor having to send an email themselves. No other page, and no other credential, makes a network call.

## Analytics

`analytics.js` uses GA4 `G-7DQS782PJN` and Microsoft Clarity `yjpn9hzcac` on the production homepage, selected-work page, and get-started page only. `privacy.html` provides preferences without tracking itself. Unlisted drafts and non-production hosts are excluded.

**Deployment check:** Enhanced measurement was verified OFF in the Google-served tag on September 17, 2026. Keep it OFF in GA4 Admin → Data streams → MT web stream. Keep automatic form/outbound collection off. Custom events deliberately never include link URLs or user text.

- Basic consent: the Google tag is not requested until opt-in. No tracking requests are made after rejection; the site remains usable.
- Footer Analytics preferences permits withdrawal. The Google disable flag and Clarity stop API stop collection; accessible provider cookies are removed. Consent preferences and GA cookies expire after 180 days; Clarity controls its cookie lifetimes.
- Events: `contact_click` (fixed placement), `linkedin_click`, and `case_select` (known case ID).
- Email clicks indicate intent, not email delivery, leads, or purchases. Mark selected events as key events in GA4 if desired; no dashboard-side configuration is implied by this code.
- Advertiser signals and ad personalization are disabled; Clarity uses Consent V2 with analytics granted and advertising denied only after opt-in. The get-started page's AI Coach and questionnaire panels are explicitly masked from Clarity replay (matching how the old worksheet was masked), and generated mailto bodies stay out of DOM attributes. Clarity is excluded on query-bearing visits, unrecognized fragments, and private internal or query-bearing referrers.
- Owner/test exclusion: visit `https://mtsolutions.group/?analytics=off` in each browser. `?analytics=on` clears that exclusion but does not bypass consent. Global Privacy Control also prevents tracking.
- Page URLs exclude queries/hashes; external referrers retain origin only; private internal referrer paths are dropped. Only simple alphanumeric/hyphen/underscore UTM source, medium and campaign labels are passed.
- Browser checks covered rejection/reload, acceptance, withdrawal and cookie cleanup, preview/privacy/owner exclusion, mobile layout, mouse/keyboard case selection, failed clipboard operations, and no answer/query sentinel in event payloads. Real Google tag collection was intercepted locally (no synthetic visits sent), verifying pageview and custom-event request construction. GA4 dashboard receipt still requires a live consenting visit and dashboard verification.
