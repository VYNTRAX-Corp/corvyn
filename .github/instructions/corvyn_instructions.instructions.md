---
applyTo: "**/*"
description: Project context and development guidelines for Corvyn
---

# Corvyn — Development Context (for AI assistants)

**Version:** 1.0 — 2026-09-13
*(Keep this in sync with corvyn_plan.md — if the MVP scope or rules change there, update this file too, and bump the version below.)*

This is a working brief for an AI coding assistant (Claude Sonnet 5 in VS Code / GitHub Copilot) helping write code for this project. Read it in full before proposing code or architecture. I am currently the sole developer, no team.

---

## 1. What this project is

**Corvyn** is a mobile app where people report threats to life and society: crime, accidents, fires, fallen trees, environmental violations (chemical spills), illegal activity, and wanted-persons alerts (official sources only, see rule R1). Reports are verified by the community (Waze-style: "confirm" / "don't see this"), users build a trust rating, and eventually there's an internal cryptocurrency tied to activity.

Open source, built for eventual global scale, but launching in Lithuania first, in 3 languages (Lithuanian, English, Russian). Solo development, no team, no large budget.

---

## 2. How you should help me (important)

- I'm working alone, so **prefer existing open source solutions wherever possible** — don't build infrastructure from scratch without a clear reason
- Work in small steps: one feature/screen at a time, not "generate the whole app at once"
- If a step needs an architectural decision that isn't covered in this document — **ask, don't silently guess**
- State your assumptions explicitly when a task is ambiguous
- Don't add features outside the MVP scope (section 4), even if they exist in the broader project plan — they're deliberately marked as later phases

---

## 3. Tech stack (locked in, don't revisit without a real reason)

| Layer | Technology |
|---|---|
| Mobile app | Flutter (single codebase for iOS + Android) |
| Backend | Node.js (NestJS) or Python (FastAPI) — pick one and stick with it |
| Database | PostgreSQL + PostGIS (geodata) |
| Cache/queues | Redis |
| File storage (photo/video) | MinIO (S3-compatible, self-hosted) |
| Localization | Standard Flutter i18n package (`intl` / `easy_localization`) — from the first screen, don't hardcode strings |
| MVP hosting | Hetzner / OVH |
| Web (later, not MVP) | Flutter Web or Next.js — decide when we reach phase 3 |

---

## 4. MVP scope — what we're building now

Only this. Everything else is in section 5 ("not now").

1. Registration: anonymous submission with no account (tier 0) + basic login/password account (tier 1) — **no email, no phone at this stage**; phone gets added when we build the mining feature
2. Report submission: photo/video + geo point + threat category + text
3. Threat categories with different verification strictness (see section 6, rule R1) — minimum for now: "road hazard/emergency" (low bar) and "accusation against a named person/organization" (high bar, see R1)
4. Report map (view + submit near a point)
5. Waze-style confirmation: "confirm" / "don't see this" / "no longer relevant"
6. Simple trust rating: +1 for a confirmed report, -1 for a debunked one
7. Automatic face-blurring on photos by default (see rule R2)
8. Emergency-services disclaimer — shown on first app launch and on every "life-threatening" category report (see rule R3)
9. Localization into 3 languages from the first screen: lt, en, ru

---

## 5. Deliberately NOT now (don't propose or add without an explicit request)

- Cryptocurrency / mining / testnet / vesting — phase 2+
- Node federation (ActivityPub-style architecture)
- Storage-mining (Storj/Filecoin integration)
- Web version
- AI adapter for auto-verification (an architectural stub is fine, but not an implementation)
- Device fingerprinting / graph-based collusion analysis
- Full blockchain/tokenomics

These sections exist in the overall project plan (a separate document — I'll share it if context is needed), but aren't needed for code right now. If you're proposing architecture, leave room for them (e.g., a separate service/module with a clean boundary), but don't implement them.

---

## 6. Rules that must NOT be violated in code (business-critical, not just technical detail)

### R1 — Unverified personal accusations are never published with identity
A report naming or showing a specific private individual in connection with a crime is published, by default, **without a visible face and without a name** (face auto-blurred), unless an official source is confirmed (police bulletin, etc.). Without a match, only the fact of the incident is visible — no personal identity attached. This rule must live in server-side moderation logic, not just the UI — don't rely on the frontend "just not showing it"; the check must be enforced on the backend.

### R2 — Face blurring by default
Any photo/video containing people has faces automatically blurred on upload, unless it's a self-report. The user can manually undo the blur, but it's on by default — this is NOT a setting the user has to go find.

### R3 — Emergency-services disclaimer
The app's first screen, and the modal shown when creating a "life-threatening" category report, must display: "this is not an emergency service — if you are in immediate danger, call [local emergency number]." Do not remove it or make it skippable without interaction.

### R4 — Photo metadata is stripped before publishing
EXIF data (geo, time, device) is stripped from photos/videos before they're saved to public storage. The map's geo point is public and approximate (can be blurred to a district/area), not the exact address from EXIF.

### R5 — Anonymous tier 0 is always available
The ability to submit a report with no account and no personal data (aside from an anti-bot check) must remain available at all times — don't remove it later when adding auth/mining features.

---

## 7. Rough data model (high-level, for orientation)

```
User
  id, pseudonym, password_hash (nullable — anonymous allowed),
  trust_rating, verification_level (0/1/2...),
  created_at

Report
  id, author_id (nullable), category, threat_level,
  geo_point (approx), text, media[], status
  (unverified / community_confirmed / moderator_confirmed),
  contains_person_claim (bool), person_verified_official (bool),
  created_at

Confirmation
  id, report_id, user_id, type (confirm/deny/outdated), created_at

Media
  id, report_id, file_url, faces_blurred (bool), exif_stripped (bool)
```

This is a starting point, not a final schema — feel free to suggest improvements as we go.

---

## 8. Glossary (so terms from the broader plan don't cause confusion if they come up)

- **Trust rating** — points for confirmed/debunked reports (already in MVP)
- **Verification level** — 0 (anonymous) / 1 (login+password) / 2 (phone, later) — sets an influence ceiling; MVP only covers tiers 0-1
- **Mining / testnet / vesting** — crypto mechanics, fully deferred, not implemented now
- **R1-R5** — see section 6, business-critical rules

---

*A separate document will follow later with anti-hallucination instructions for the model during coding — this file covers WHAT we're building, that one will cover HOW the model should double-check itself.*

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-09-13 | First English baseline: MVP scope, tech stack, R1-R5 rules, data model sketch |
