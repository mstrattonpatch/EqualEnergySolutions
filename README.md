# Equal Energy Solutions — website

The website for **Equal Energy Solutions**, a local electrical, air conditioning and refrigeration contractor based in Braddon, ACT. It's built from the Equal Energy design package (`docs/Equal-Energy-Website-Design-Package.pdf`).

It's a plain static site (HTML, CSS and a little JavaScript), so there's no build step. It runs on any host.

```
index.html        Homepage: emergency bar, hero, services, about, team, why us, reviews, Instagram, quote form
emergency.html    24/7 emergency landing page (for Google Ads / "emergency electrician" searches)
privacy.html      Privacy policy (covers the quote form and assistant)
css/styles.css    All styling. Brand colours and fonts are at the top.
js/config.js      ← BUSINESS DETAILS: phone, email, ABN, licences, links, form endpoint
js/main.js        Fills in details from config.js, plus the mobile menu, quote form and assistant
images/           Logo, favicon, and where real photos go
docs/             Original design package
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and go to http://localhost:8000.

## Before launch

### 1. Business details
Fill in **`js/config.js`**. The phone number, email, ABN, licence numbers, hours and service area update everywhere on the site from there: tap-to-call buttons, footer, assistant answers and Google's business info.

Also replace these placeholders in the HTML:
- **Team** (`index.html`, "Meet the team"): roles and one-line bios. The names Matt, Harry, Archie, Ed and Daniel come from customer reviews, so confirm the spelling and who should be listed.
- **Privacy policy** (`privacy.html`): get it reviewed.

### 2. Photos (design package: "real team, real jobs")
- Hero: add `<img class="hero__photo" src="images/hero.jpg" alt="…">` inside `.hero__visual`.
- About: add `<img src="images/about.jpg" alt="…">` inside `.about__visual`.
- Team: replace each `<span class="member__initial">` with `<img src="images/team-matt.jpg" alt="Matt">` (4:5 headshots).
- Instagram tiles: add an `<img>` in each tile, or swap the grid for a feed widget (Elfsight, Behold or SnapWidget).

### 3. Quote form
- **Netlify:** works automatically. Submissions appear under Site → Forms. Turn on email notifications there.
- **Any other host:** create a free form at formspree.io and paste its URL into `formEndpoint` in `config.js`.
- With neither, the form opens the visitor's email app, addressed to the business email.

### 4. Google reviews
The six reviews on the homepage are real Google reviews. Add the Google Business Profile **reviews link** and **"Ask for reviews" share link** to `config.js`. Optionally, swap the cards for a live widget (Elfsight or Trustindex).

### 5. Assistant
The chat assistant answers the FAQ starter list from the design package with preset answers. Its guardrails: it never gives prices, never gives DIY electrical advice, sends dangerous situations to 000 or the 24/7 line, and nudges people to the quote form. To upgrade it to a real AI assistant, replace it with Tidio, Chatbase or Voiceflow, trained on the services list and the FAQs in `js/main.js`.

### 6. Launch checklist (from the design package)
- [ ] Domain (e.g. equalenergysolutions.com.au) and business email on the domain
- [ ] Quote form → email, with an auto-reply
- [ ] Tap-to-call checked on a phone
- [ ] Google reviews links live
- [ ] Instagram feed embed
- [ ] Privacy policy reviewed
- [ ] Google Analytics and Search Console
- [ ] Page speed and mobile check
- [ ] Website linked from the Google, Instagram and Facebook bios

## Hosting

**Netlify (recommended, free):** connect this GitHub repo in Netlify ("Add new site → Import from Git"), leave the build command empty, and set the publish directory to `/`. Netlify picks up the quote form automatically. Then add the custom domain.

**GitHub Pages:** go to Settings → Pages → Deploy from branch → `main` / root. Pages needs a public repo on a free GitHub plan. Use Formspree for the form.
