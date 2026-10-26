/*
 * ─────────────────────────────────────────────────────────────
 *  EQUAL ENERGY SOLUTIONS — BUSINESS DETAILS
 *  Edit this one file to update the phone, email, licences and
 *  links everywhere on the site. Anything still in [BRACKETS]
 *  is a placeholder that needs the real value before launch.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE = {
  phone: "[PHONE NUMBER]",          // shown on the site, e.g. "0400 000 000"
  phoneLink: "",                    // dialled number, e.g. "+61400000000" (leave blank to derive from phone)
  email: "[EMAIL ADDRESS]",         // e.g. "hello@equalenergysolutions.com.au"

  abn: "[ABN]",
  electricalLicence: "[LICENCE NUMBER]",
  arctickLicence: "[ARCTICK NUMBER]",

  serviceArea: "Canberra & surrounds",   // e.g. "Canberra, Queanbeyan & surrounds"
  hours: "Mon–Fri [7am–5pm] · Emergency 24/7",
  responseTime: "1 business day",

  // Google Business Profile links. Until the real ones are added these fall back to a Google Maps search.
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Equal+Energy+Solutions+Braddon+ACT",
  googleWriteReviewUrl: "https://www.google.com/maps/search/?api=1&query=Equal+Energy+Solutions+Braddon+ACT",

  instagramUrl: "https://www.instagram.com/equalenergysolutions/",
  facebookUrl: "https://www.facebook.com/p/Equal-Energy-Solutions-61576045104167/",

  // Quote form delivery. Pick ONE:
  //  - Netlify hosting: leave formEndpoint blank — Netlify Forms picks the form up automatically.
  //  - Anywhere else: create a free form at https://formspree.io and paste its URL here,
  //    e.g. "https://formspree.io/f/abcdwxyz".
  //  - Neither: the form falls back to opening the visitor's email app addressed to `email` above.
  formEndpoint: ""
};
