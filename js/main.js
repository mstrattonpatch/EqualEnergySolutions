(function () {
  "use strict";
  var S = window.SITE || {};
  var isPlaceholder = function (v) { return !v || /\[.*\]/.test(v); };
  var telHref = function () {
    var n = S.phoneLink || (S.phone || "").replace(/[^\d+]/g, "");
    return isPlaceholder(S.phone) || !n ? "#contact" : "tel:" + n;
  };

  /* ── Fill business details from config.js ───────────────── */
  document.querySelectorAll("[data-site]").forEach(function (el) {
    var v = S[el.getAttribute("data-site")];
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = telHref(); });
  document.querySelectorAll("[data-mailto]").forEach(function (a) {
    a.href = isPlaceholder(S.email) ? "#contact" : "mailto:" + S.email;
  });
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var v = S[a.getAttribute("data-link")];
    if (v) a.href = v;
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ── LocalBusiness schema (SEO basics in the design package) ── */
  var schema = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: "Equal Energy Solutions",
    description: "Local electrician in Braddon — switchboards, EV chargers, lighting, air conditioning & refrigeration. 24/7 emergency service.",
    address: { "@type": "PostalAddress", addressLocality: "Braddon", addressRegion: "ACT", addressCountry: "AU" },
    areaServed: ["Canberra", "Queanbeyan"],
    sameAs: [S.instagramUrl, S.facebookUrl].filter(Boolean),
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "00:00", closes: "23:59" }
  };
  if (!isPlaceholder(S.phone)) schema.telephone = S.phone;
  if (!isPlaceholder(S.email)) schema.email = S.email;
  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify(schema);
  document.head.appendChild(ld);

  /* ── Mobile nav ─────────────────────────────────────────── */
  var toggle = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ── Quote form ─────────────────────────────────────────── */
  var form = document.getElementById("quote-form");
  if (form) {
    var status = form.querySelector(".form__status");
    var show = function (msg, ok) { status.textContent = msg; status.className = "form__status " + (ok ? "ok" : "err"); };
    var onNetlify = /netlify\.app$/.test(location.hostname) || document.documentElement.hasAttribute("data-netlify-host");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      if (d.get("bot-field")) return;
      if (!d.get("name") || (!d.get("phone") && !d.get("email"))) {
        show("Please add your name and a phone number or email so we can get back to you.", false);
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      var done = function () {
        form.reset();
        show("Thanks " + d.get("name") + " — we’ve got your enquiry and will be in touch within " + (S.responseTime || "1 business day") + ". For emergencies, call us any time.", true);
        btn.disabled = false;
      };
      var fail = function () {
        show("Sorry, that didn’t send. Please call us on " + S.phone + " or email " + S.email + ".", false);
        btn.disabled = false;
      };
      btn.disabled = true;

      if (S.formEndpoint) {
        fetch(S.formEndpoint, { method: "POST", body: d, headers: { Accept: "application/json" } })
          .then(function (r) { r.ok ? done() : fail(); }).catch(fail);
      } else if (onNetlify) {
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(d).toString() })
          .then(function (r) { r.ok ? done() : fail(); }).catch(fail);
      } else {
        var body = ["Name: " + d.get("name"), "Phone: " + d.get("phone"), "Email: " + d.get("email"), "Suburb: " + d.get("suburb"), "Type of work: " + d.get("job"), "", d.get("message")].join("\n");
        location.href = "mailto:" + (isPlaceholder(S.email) ? "" : S.email) + "?subject=" + encodeURIComponent("Quote request — " + d.get("job")) + "&body=" + encodeURIComponent(body);
        btn.disabled = false;
      }
    });
  }

  /* ── Assistant (FAQ chatbot) ────────────────────────────────
     Preset answers from the "Chatbot FAQ starter list" in the design package.
     Guardrails: never quotes exact prices, never gives DIY electrical advice,
     sends anything dangerous straight to 000 / the 24/7 line.
     Swap for a hosted AI service (Tidio, Chatbase, Voiceflow) when ready. */
  var panel = document.getElementById("chat-panel");
  if (!panel) return;
  var log = document.getElementById("chat-log"), chips = document.getElementById("chat-chips");
  var phoneLink = function () { return '<a href="' + telHref() + '">' + S.phone + "</a>"; };
  var quoteLink = '<a href="index.html#contact" data-close-chat>quote form</a>';

  var A = [
    { q: "What services do you offer?", k: ["service", "what do you do", "what work", "offer"],
      a: function () { return "Residential, commercial and maintenance electrical — switchboard upgrades, EV chargers, lighting and power — plus air conditioning and refrigeration for homes and businesses, and a 24/7 emergency service."; } },
    { q: "Do you do air con & refrigeration?", k: ["air", "a/c", "aircon", "refrig", "fridge", "freez", "cool room", "coolroom", "split", "ducted"],
      a: function () { return "Yes — for homes and businesses. We supply, install, service and repair split and ducted systems, commercial A/C, cool rooms and commercial fridges and freezers."; } },
    { q: "Is there a 24/7 emergency service?", k: ["emergenc", "urgent", "24", "after hours", "call-out", "callout", "call out"],
      a: function () { return "Yes, 24/7. If you’ve lost power or a safety switch won’t reset, call us on " + phoneLink() + ". Call-out fees depend on the time and job — we’ll tell you upfront on the phone."; } },
    { q: "Which suburbs do you cover?", k: ["area", "where", "suburb", "location", "canberra", "queanbeyan", "cover"],
      a: function () { return "We’re based in Braddon and work across " + S.serviceArea + ". Pop your suburb in the " + quoteLink + " and we’ll confirm."; } },
    { q: "How do I get a quote?", k: ["quote", "price", "cost", "how much", "photo", "estimate"],
      a: function () { return "Quotes are free. Fill in the " + quoteLink + " with a short description and we’ll get back to you within " + S.responseTime + ". Many small jobs can be quoted from a few photos. We don’t give exact prices in chat as every job is a bit different."; } },
    { q: "Can you install an EV charger?", k: ["ev", "charger", "tesla", "electric car", "vehicle"],
      a: function () { return "Absolutely. We install home and workplace chargers, check your switchboard capacity and handle any upgrades needed."; } },
    { q: "Do I need a switchboard upgrade?", k: ["switchboard", "fuse", "solar", "battery", "rcd", "safety switch"],
      a: function () { return "Often, if you’re adding an EV charger, solar or a battery — or if you still have old ceramic fuses. We’ll check your board and only recommend an upgrade if you actually need one."; } },
    { q: "Are you licensed and insured?", k: ["licen", "insur", "qualified", "arctick", "certif"],
      a: function () { return "Yes — fully licensed and insured electrical contractors, with ARCtick refrigerant handling for A/C and refrigeration work."; } },
    { q: "Do you do commercial maintenance & test and tag?", k: ["commercial", "maintenance", "test and tag", "test & tag", "strata", "office", "shop", "exit", "emergency light"],
      a: function () { return "Yes — fit-outs, test and tag, emergency and exit lighting, and scheduled maintenance for offices, retail, hospitality and strata."; } },
    { q: "What are your hours?", k: ["hour", "open", "when", "how soon", "available", "today"],
      a: function () { return S.hours + ". Many jobs are booked within a day or two — and emergencies any time on " + phoneLink() + "."; } }
  ];
  var DANGER = ["spark", "burning", "smoke", "fire", "shock", "electrocut", "live wire", "exposed wire", "melt", "smell"];
  var DIY = ["myself", "diy", "how do i wire", "how to wire", "can i fix", "replace it myself"];

  var esc = function (t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; };
  var say = function (html, who) {
    var d = document.createElement("div");
    d.className = "bubble bubble--" + who;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  };
  var reply = function (html) { setTimeout(function () { say(html, "bot"); }, 380); };
  var asked = 0;
  var maybeNudge = function () {
    asked++;
    if (asked === 3) setTimeout(function () {
      say("Happy to keep answering — or if you’d like the team to follow up, leave your name, phone and suburb in the " + quoteLink + " and a real person will be in touch.", "bot");
    }, 900);
  };
  var answer = function (text) {
    var l = text.toLowerCase();
    if (DANGER.some(function (w) { return l.indexOf(w) > -1; })) {
      return reply("That sounds dangerous. <strong>Stay away from it and don’t touch anything.</strong> If anyone is hurt or there’s fire, call <a href=\"tel:000\">000</a> now. Otherwise call our 24/7 line on " + phoneLink() + " — if it’s safe, switch off the main switch at the board.");
    }
    if (DIY.some(function (w) { return l.indexOf(w) > -1; })) {
      return reply("We can’t give DIY electrical advice — in the ACT electrical work has to be done by a licensed electrician, for your safety. We’re happy to take a look: call " + phoneLink() + " or use the " + quoteLink + ".");
    }
    var hit = null;
    A.some(function (x) { if (x.k.some(function (w) { return l.indexOf(w) > -1; })) { hit = x; return true; } return false; });
    reply(hit ? hit.a() : "Good question — the team can help with that. Call " + phoneLink() + " or send the " + quoteLink + " and we’ll get back to you shortly.");
    maybeNudge();
  };

  A.forEach(function (x) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = x.q;
    b.addEventListener("click", function () { say(esc(x.q), "me"); reply(x.a()); maybeNudge(); });
    chips.appendChild(b);
  });
  say("G’day! I’m the Equal Energy assistant. Ask about our services, service areas, quotes or emergencies — or tap a question below.", "bot");

  document.getElementById("chat-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var i = document.getElementById("chat-input"), v = i.value.trim();
    if (!v) return;
    say(esc(v), "me");
    i.value = "";
    answer(v);
  });
  var openChat = function () { panel.classList.add("open"); document.getElementById("chat-input").focus(); };
  var closeChat = function () { panel.classList.remove("open"); };
  document.querySelectorAll("[data-open-chat]").forEach(function (b) {
    b.addEventListener("click", function () { panel.classList.contains("open") ? closeChat() : openChat(); });
  });
  document.getElementById("chat-close").addEventListener("click", closeChat);
  log.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close-chat")) closeChat(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeChat(); });
})();
