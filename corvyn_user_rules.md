# Corvyn — User Rules (draft)

**Version:** 1.0 — 2026-09-13

This is a working draft of the community guidelines / user agreement. It's written to set the structure and logic, but **it does not replace legal review** — laws on personal data, the right to one's own image, and privacy protection vary a lot by country, and before a real launch this text needs to go through a lawyer (ideally in each launch country separately, starting with Lithuania).

---

## 1. General principle

The platform is about incidents, not about people. Default rule: **report the situation, don't put a specific person on display**, unless there's a direct safety need to do so.

---

## 2. People's faces in photos/videos

**Why this is its own category.** In most EU countries, a photo where a specific person is recognizable counts as their personal data (GDPR), and in some countries (e.g., Germany, France) there's an additional, separate "right to one's own image" — publishing a recognizable face without consent can be a violation on its own, regardless of the caption.

**Platform rule:**
- When uploading a photo/video containing people, the app **automatically suggests blurring faces** — this is default behavior, not a setting hidden in a menu
- A user may publish with a visible face only when:
  - It's their own face (a self-report)
  - The person is a public official acting in a public capacity (with the caveats below)
  - There's an official source (a police wanted bulletin) — see rule A1 in the technical plan
- In every other case, faces are blurred by default; the incident itself (a fallen tree, an accident, litter) is perfectly visible without bystanders' faces in the photo

**What we show the user in the moment (UX, not just a line in a contract):**
- "This photo shows a person's face. If it's not relevant to the threat you're reporting, we recommend blurring it" + an "Auto-blur" button
- If the user publishes with a visible face anyway — a short, explicit warning about personal responsibility for that choice (not the platform's)

---

## 3. What can never be published (hard list)

- Accusing a specific private individual of a crime, with a visible face/name, without an official source (see rule A1 in the technical plan — without a match, such reports are published de-identified)
- Images of minors where they're recognizable, except in cases of direct danger to their safety (e.g., a missing child per an official bulletin — with mandatory moderation)
- Home addresses, phone numbers, identity documents — either one's own or other people's
- License plates — in many jurisdictions these also count as personal data; blur these by default alongside faces
- Sexual content, content inciting violence against specific people
- Information that could be used to cause harm: a person's exact address "for retaliation," instructions for illegal acts, and so on

---

## 4. What can and should be published

- The incident itself: location (a geo point), time, threat type, photo/video of the situation (faces blurred by default)
- For accidents/fires/environmental threats — specifics are welcome: what happened, scale, whether the threat is ongoing
- For illegal activity/environmental violations by companies — facts and evidence (documents, photos of waste dumping, etc.), but with the same verification threshold as for individuals (section B of the technical plan) — an unsubstantiated accusation is just as risky for a company as for a person

---

## 5. Regional considerations (rough list — needs legal review per launch country)

- **EU (including Lithuania)** — GDPR: a photo with a recognizable face is personal data, requiring a legal basis for processing; some countries (Germany, France, Spain) have a stricter "right to one's own image" on top of GDPR
- **UK** — an equivalent to GDPR (UK GDPR) + the Data Protection Act, similar logic
- **US** — no single federal privacy-of-image law, but individual states (Illinois — BIPA for biometrics, California — CCPA/CPRA) have their own strict requirements, especially relevant if the project ever adds facial recognition
- **Countries with "discrediting authorities"/censorship laws** — see point C of the technical plan: in some jurisdictions, simply reporting government misconduct can be legally risky for the user, not just the platform — this should be explicitly stated in the rules ("publishing this kind of content may be legally risky for you personally in your country")

---

## 6. Consequences of violations

- Automatic blurring/hiding of content that violates the rules — without waiting for a complaint, if the violation is obvious (an open face + an unsourced accusation)
- Trust rating penalty (see the technical plan, section 2) for confirmed violations
- Repeat/serious violations — account restrictions or a ban (in terms of verification tiers — section 8 of the technical plan)
- A transparent appeals process — the user must be able to contest a decision

---

*This document should be kept alongside the main technical plan — the rules in sections 3 and 5 directly implement the technical mechanisms (A1, face blurring, category-based verification thresholds) from the technical plan.*

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-09-13 | First English baseline: face-blurring rules, hard-list of never-publish content, regional legal notes, violation consequences |
