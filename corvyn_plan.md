# Corvyn — Project Plan

**Version:** 1.0 — 2026-09-13
*(First English baseline, consolidating all decisions made so far. See Changelog at the end of this document for future updates.)*

*(Working name — chosen to be abstract and easy to read in any country; the root echoes the Latin corvus, "raven," a symbol of vigilance and warning across many cultures. Checked by search for conflicts in the safety/civic-app space — clean so far; a final check via the WIPO Global Brand Database and domain/App Store availability is still needed before official registration.)*

A platform for reporting any threat to human life and to the healthy functioning of society: crime and wanted-persons alerts, accidents, fires, fallen trees and other road hazards, chemical spills and pollution, illegal activity, and any other situation that authorities may ignore or downplay. Open source, donation-based, built for global scale.

---

## 0. Critical risks and pitfalls (read before starting)

An honest outside look at what could actually sink this project — not a reason to give up, but a list of things to think through before launch, not after. I'm not a lawyer, and at some point the items below will need real legal advice (ideally across several jurisdictions at once, not just Lithuania/EU).

**A. Vigilante justice and misidentification — probably the single biggest risk**
- "Photo of a wanted criminal" sounds useful, but in practice it's the most dangerous element of the whole platform: a misidentification (wrong person, outdated photo, resemblance) could lead to a mob physically attacking an innocent person — this has already happened on other platforms and on social media
- Recommendation: either fully exclude the "wanted person" category from the MVP, or allow it **only** tied to an official source (a police bulletin, an official wanted notice), never as "I recognized a criminal on the street" — letting users identify people themselves is a feature with enormous harm potential and minimal benefit relative to the risk

**A1. A hard rule against unfounded personal accusations (key addition)**
The classic scenario to avoid at all costs: someone posts a photo of a private individual captioned "this is a pedophile, he approached my daughter in a store" — no evidence, no official source, just their word. This is possible, and happens regularly, on Facebook and similar platforms; we don't want to be that kind of platform.

Rule: **any report that names or shows a specific private individual in connection with a crime is not published with identifying information by default**, until it passes a check:
- The face/name is automatically checked (via the AI adapter, section 7a) against open official databases (public police wanted bulletins, official press releases) — this is a technical check, not a final verdict
- If there's no match with an official source, the report is published **without the person's face and without a name** (the face is auto-blurred), with text along the lines of "suspicious activity reported in [area], identity unconfirmed" — the community still sees the threat/incident, but no specific person is publicly accused without grounds
- Only when there's an official match (a real wanted notice) can identifying information be shown, and even then it must go through mandatory human moderation, not be fully automatic
- The same rule applies to accusations against companies/organizations (section B) — without solid evidence, what's published is "a suspected threat in area X," not a direct accusation of a named actor

**B. Defamation law — varies sharply by country**
- In some countries, defamation is a criminal matter, not just a civil one (including in a number of EU countries and beyond), and liability can fall not just on the author of the post but on the platform that hosted it and didn't remove it
- A report saying "Company X is dumping chemicals in the river" or "Person Y is a criminal" without solid evidence is a direct legal risk for you as the platform operator, not just for the poster
- The tiered verification thresholds by category (already built into section 2) need to be tightened specifically for "accusation against a named person/company" — this needs the highest bar, and possibly mandatory human moderation rather than crowdsourcing alone

**C. Laws against "fake news" and undermining government authority — critical given the goal of "surfacing what authorities want hidden"**
- A number of countries (not just "exotic" jurisdictions — such laws keep appearing or tightening in various parts of the world) have laws against "discrediting authorities," "false public information," even "foreign agent" status for platforms publishing content inconvenient to the state
- For a truly global project, this means: what's legal in one country can be a criminal offense in another — and a team/infrastructure physically located in such a country is itself at risk, not just the content
- Mitigation: the federated architecture (section 1) isn't just a technical choice here, it's a legal necessity — a node in a jurisdiction with harsh laws should be able to technically avoid hosting content deemed illegal locally, without blocking visibility for the rest of the world

**D. Platform liability for user content (intermediary liability)**
- In the EU this is governed by the Digital Services Act (DSA) — moderation, transparency, and complaint-response obligations scale with platform size; in the US, Section 230 gives hosts more protection, but it's not an absolute shield and is subject to ongoing litigation
- At global scale, a platform physically cannot comply with every country's laws simultaneously — it's important to decide early which jurisdiction the parent organization/foundation is registered under, as a deliberate choice, not a default

**E. False alarms replacing/interfering with real emergency services**
- Risk: people may treat the app as an alternative to 112/911 during a real emergency and delay calling emergency services, relying on the app instead — if that causes a delay in real help arriving, it's a reputational and potentially legal disaster
- Mandatory: a clear, unavoidable disclaimer on first launch and on every "life-threatening" category report — "this is not an emergency service; if you are in immediate danger, call [local emergency number]"

**F. Financial sustainability: donations are historically fragile for open source projects**
- Many open source projects with a similar social mission (including Ushahidi) have struggled for years specifically with funding, not technology — a donation-only model rarely covers even basic hosting at global scale, let alone the regulatory/legal costs from points B-D
- Regulatory work (lawyers across multiple jurisdictions, possible registration as a crypto-asset service provider under MiCA) costs real money that individual donations rarely cover at the start — grant funding (digital rights organizations, press freedom foundations) is more realistic as a primary source than "we'll live on donations"

**G. The cold-start problem**
- A map with 3 reports in a city is useless — people won't keep using an app that's empty; the competition isn't another similar app, it's emptiness
- You need a strategy for the first region/city: e.g., a partnership with a local NGO or journalists who can seed initial content, rather than expecting organic growth from zero at global scale immediately

**H. Volunteer moderation — capture risk**
- A volunteer moderator in a sensitive region can themselves become a target of pressure (including from local authorities), or, conversely, could be planted by a bad actor to moderate in someone's favor
- Needs moderator rotation, multiple sign-off on takedown decisions (not one moderator deciding alone), and a transparent public log of moderation decisions

**I. Metadata still leaks, even with encryption (section 4a)**
- Encrypting content doesn't hide the *fact* that a specific person sent something at a specific time from a specific location — network traffic, activity timing, and file size alone can deanonymize an informant against a sufficiently motivated observer (this is a known weakness even in Tor/SecureDrop-style systems)
- This limitation should be communicated honestly to users from the start, rather than promising absolute anonymity

**J. State-level/coordinated collusion — larger scale than 30 people**
- Section 2a addresses "organic" collusion by a group of people; but a state actor with resources could run a much larger info operation (thousands of accounts, real documents, purchased phone numbers) — this can't be fully defended against, but it should be part of the threat model rather than assuming the section 2a mechanisms are universal against any scale of attacker

**What to do first, before writing any code**
1. Decide on the parent organization's home jurisdiction (foundation/NGO) and get at least preliminary legal advice on points B-D
2. Explicitly exclude or heavily restrict the "wanted person" category in the MVP (see A1 — no identity is published without an official match)
3. Write the emergency-services disclaimer — before any other UI text
4. Rethink the financial model — grants/NGO partnerships as the primary plan, donations as a supplement
5. Pick one pilot region with a real on-the-ground partner, rather than launching "the whole world" at once

**K. Realistic context: solo development**
The project is being built by one person, not a team — this changes priorities, not just timelines:
- Many sections of this plan (federation, storage-mining, a full blockchain) are months of work even for a team; solo, the right strategy is to build on existing open source solutions (Supabase/Firebase, Storj/Filecoin, ready-made auth providers) wherever possible, rather than writing everything from scratch
- From section 0, prioritize what's cheap in time but expensive in risk if skipped: the emergency-services disclaimer, rule A1 on personal accusations, restricting the "wanted person" category — none of this needs infrastructure, just thoughtful UX and copy from the first screen
- What requires a lot of resources (node federation, a custom blockchain, storage-mining) is deliberately deferred to later phases (already reflected in the roadmap, sections 5-6 of the table) and doesn't block the MVP launch

**L. Localization and target countries at launch**
- MVP launches in Lithuania, but in 3 languages from day one, not just Lithuanian: **Lithuanian, English, Russian** — this covers the local audience as well as Russian-speaking residents of the region, and makes the product legible to potential grantors/partners outside Lithuania
- Technically: build the i18n layer in from day one (e.g., standard Flutter/React localization libraries — `intl`, `easy_localization`), rather than hardcoding Lithuanian text — adding a 4th, 5th language later should just be translating strings, not rewriting screens
- Further language/country expansion happens as the project grows — no need to pre-translate into 20 languages for the sake of "global from day one"; the federated architecture (section 1) allows adding regions/languages gradually, node by node either way

---

## 1. Architecture and open source stack

Principle: decentralization and portability from day one — if one server/jurisdiction becomes a problem, the project should survive it.

**Backend**
- Node.js (NestJS) or Python (FastAPI) — both fully open source, large communities
- PostgreSQL + PostGIS — geodata for incidents, clustering by region
- Redis — queues, ratings, cache

**File storage (photos/videos of incidents)**
- MinIO (open source, S3-compatible) — can be deployed anywhere, including your own servers in different countries
- IPFS as an optional layer — for content that needs to be un-deletable/censorship-resistant (disputed reports, evidence)

**Frontend — mobile-first**
- Priority: mobile app, since the core scenario is photographing/reporting an incident on the spot, from a phone
- **Flutter** (open source, Google) or React Native — I recommend Flutter: one codebase for both iOS and Android, better out-of-the-box handling of camera/geo/offline mode
- Web version — a second-stage effort, but from the start it's worth separating business logic (API client, data models) into a shared layer so the web version reuses it later instead of being written from scratch
  - With Flutter — there's Flutter Web, so the same code can be partly adapted for the browser
  - With React Native — the web version would be React/Next.js, but with a shared API layer and shared types
- Web at launch should be minimal — a public read-only map of reports for people without the app, not a way to submit reports

**Federation for global scale**
Instead of one central server for the whole world — an ActivityPub-style architecture (like Mastodon): independent nodes by country/region that sync public data with each other.
- Pros: each node lives within its own jurisdiction and follows local law, but data is visible globally
- Cons: harder to build — can be deferred to phase 2, starting with a single region

**Hosting**
- At launch: Hetzner / OVH (cheaper than AWS, has EU data centers)
- As it grows: a community of node operators (like Mastodon/Matrix), each volunteer running their own node — reduces the load on donations

---

## 2. Report verification

Goal: don't let the platform fill up with false information, but don't create so much bureaucracy that it scares off informants.

**Threat categories** — since the scope is broad (crime, road accidents, fires, fallen trees, missing persons, chemical spills, illegal activity, etc.), a category system with different verification thresholds is needed from day one: "road hazard" (a tree, an accident) can be confirmed quickly and simply, while "accusing a specific person/company of a crime" needs a much stricter check.

**Multi-layered system (Waze model as the base):**
1. **Automatic filtering** — spam/duplicates by geolocation and time, basic text moderation (open source models like Detoxify)
2. **User trust rating** — points for confirmed reports, penalties for debunked ones; new accounts have limited voting weight
3. **Crowdsourced verification, Waze-style** — other users near the map point can tap "confirm" / "don't see this" / "no longer relevant," just like Waze does with traffic and accidents; a report's status "matures" as confirmations accumulate
4. **Media evidence** — photos/videos with metadata (time, geo) increase a report's weight; EXIF can be checked for signs of tampering (open source tools like ExifTool)
5. **Report statuses** — "unverified" / "community confirmed" / "moderator confirmed" — transparently show the confidence level rather than deleting anything unconfirmed

**Moderation**
- Distributed — local volunteer moderators by region (they know local context better than a central team)
- Appeals — the author of a report must be able to contest a takedown

---

## 2a. Collusion protection and retroactive sanctions

This is a genuinely hard, separate problem: a group of 10-30 people could coordinate to confirm a fabricated report and profit from it. It can't be eliminated entirely, but it can be made expensive and risky:

**Collusion detection (graph analysis)**
- Build a graph of "who confirms whom" — if the same group of accounts systematically confirms each other (rather than random people nearby), that's a statistical anomaly that can be automatically flagged (similar to anti-fraud methods used on crypto exchanges and social networks)
- Require **confirmation diversity**: only weight confirmations from accounts with different histories, different activity locations, different devices — if all 30 confirmations came from accounts registered the same week in the same area, the report's weight should be algorithmically discounted, not just manually
- Device fingerprinting / limits on accounts per device and SIM — makes creating fake multiple identities harder (doesn't fully solve the problem, but raises the barrier for bad actors)

**Delayed payout (vesting)**
- Crypto rewards accrue not immediately but gradually over weeks/months, as a report continues to be confirmed by independent people over time — you can't "pump and dump" instantly
- Part of the reward is frozen for an extended period (say, six months to a year) — this directly creates the retroactive-review window you asked about

**Retroactive sanctions**
- If it later turns out (even 1-2 years later) that a report was false/collusive, the frozen portion of the reward is forfeited for everyone in the chain (author and confirmers)
- Every participant's trust rating drops sharply retroactively, with a public flag in the account's history
- Repeat offenses lead to restrictions (a cooldown on posting/confirming), up to a full account ban
- The review mechanism must be open: anyone (including journalists, independent auditors) can flag "this looks fabricated" even long after the fact, triggering a review

**Final backstop — independent review outside the system**
- For reports that accumulate a lot of weight (many confirmations, a large payout), it's worth a random-sample audit by independent moderators/journalists before final unfreezing — similar to decentralized "courts" like Kleros in Web3

---

## 3. Informant safety

This is critical, since the project targets topics that "authorities don't want noticed" — the risks to people are real.

- **Anonymous submission by default** — publishing a report shouldn't require an identity; an account is only needed to build up a rating (and that's optional)
- **Separation of identity and content** — even if there's a request from authorities, the platform physically should not have data linking a report to a specific person (privacy by design, not "we promise not to disclose")
- **Metadata scrubbing** — EXIF/geo is automatically stripped from photos/videos before publishing; the geo tag kept is only a public map point (which can be blurred to a district rather than an exact address)
- **Tor / .onion mirror support** — like SecureDrop — for submitting reports from places where regular internet access is monitored
- **End-to-end encryption** for sensitive attachments between an informant and a moderator, if additional verification is needed
- **A "delayed publication" option** — a report can sit in a protected state rather than publishing immediately, if the informant is still at risk

---

## 4. User protection and legal aspects

- **GDPR / privacy by design** — data minimization: collect only what's needed for the feature, don't store extra "just in case"
- **Protection against deanonymization via data correlation** — limit geo-tag precision, don't allow exporting a full activity history for one account to third parties
- **Defamation moderation** — a clear process: a report with serious accusations against specific people/organizations needs a higher verification bar than "there's a pothole here"
- **Transparent jurisdiction policy** — an open policy on what data is disclosed on an official request and what never is (e.g., metadata that could deanonymize an informant is never stored at all, so it physically can't be handed over)
- **Open code audit** — since the project is open source, security researchers can verify for themselves that privacy promises are actually implemented in code, not just on paper

---

## 4a. Storage-mining: user storage nodes (future phase)

Idea: any registered user can download a desktop node, allocate disk space and bandwidth, and earn crypto rewards proportional to their contribution — following the Storj/Filecoin/Sia model (ready-made open source protocols, no need to invent our own).

**How this protects data rather than creating risk**
- **Client-side encryption before upload** — the file is encrypted right on the mobile device, before it ever leaves the informant's phone; a storage node never sees the raw file
- **Sharding / erasure coding** — the encrypted file is cut into many pieces scattered across different nodes worldwide; no single node holds the whole file
- End result: even if a specific storage node is compromised, all that's there is a meaningless fragment of encrypted data — "a pile of broken glass" that can't be reconstructed without the other pieces and the key
- The encryption key is known only to the report's owner / the verification system — never the storage nodes

**Contribution economics**
- Node reward = a function of (allocated capacity × actually used capacity × uptime × bandwidth served) — needs proof-of-storage, so a node can't just claim contribution without actually storing data (this is the part Storj/Filecoin already solve — no need to reinvent it)
- This is a separate, parallel mechanism for earning the same internal currency, distinct from "report mining" (section 5) — the tokenomics needs to keep the two clearly separate, or it'll be confusing what exactly someone is earning coins for

**Roadmap placement**
- Not for the MVP — an add-on once the core product (reports, verification, activity mining) is already working and there's a real volume of data that needs somewhere to live
- Practical path: plug in an existing network (Storj/Filecoin) as the storage backend, rather than rolling out a custom storage protocol from scratch

---

## 5. Internal cryptocurrency (mining model) and donations

Since you want to build in crypto mechanics from the start — here's how it could work, Pi Network-style (mining speed grows with activity), adapted to our specifics:

**Accrual mechanics**
- Every new account starts with a minimal "mining speed"
- Speed increases as your reports get confirmed by independent users (see collusion protection above — confirmation weight depends on confirmer diversity, not just count)
- Speed decreases (decay) with prolonged inactivity or if reports start getting debunked — symmetric to how it grows
- Accrual is delayed/vested (see section 2a) — this is both an anti-cheat mechanism and a natural fit with "what you've mined gets confirmed over time"

**Technically, at launch**
- No need to spin up a full blockchain right away — can start with an "off-chain" ledger (a regular database with a transaction log, publicly verifiable via an open API/explorer), and move to a real blockchain (or an L2 on an existing open network) once the mechanics are tested and there's no point rebuilding everything again
- Open source options for a real blockchain later: Cosmos SDK / Substrate (Polkadot) — both let you run your own network rather than depend on someone else's

**An honest caveat** (not a reason to abandon this, but something to think through in advance rather than after the fact):
- In the EU (including Lithuania), assets like this fall under MiCA regulation — if the currency can eventually be exchanged for real money or other assets, the platform may need to register as a crypto-asset service provider, and that's a significant organizational effort, well before "going to an open market" becomes a real question
- The "earn tokens for actions" model is legally similar to "earn-to-play/click-to-earn" models, which have already drawn regulatory precedent and scrutiny in various countries — worth discussing with a lawyer early on (possibly pro bono via digital rights organizations) before promising users real monetary value for the token
- A practical MVP compromise: explicitly frame the token as "internal reputation points" that *might* become exchangeable in the future — this reduces regulatory risk at launch, without giving up the mining mechanic itself

**Donations (alongside the crypto mechanics)**
- OpenCollective / GitHub Sponsors — transparent collection and spending, the standard for open source projects
- A Patreon-style model for larger donors (NGOs, press-freedom foundations, digital rights organizations — Access Now, EFF, and similar often support this kind of initiative)

---

## 5a. Testnet and the transition to mainnet

Your idea fits well with the "practical MVP compromise" above — it just turns it into a concrete two-network mechanism instead of one network with a disclaimer.

**Principle**
- Every new account defaults into a **testnet** — the same mechanics run there (report mining, storage-node mining, vesting, trust rating), but the balance isn't convertible to anything real and can't be withdrawn
- The testnet serves three purposes at once: (1) a full trial period for the user, (2) a natural "quarantine" that keeps newly created/collusive accounts from immediately affecting the real economy, (3) continued sandbox testing of the protocol on live data before mainnet

**Criteria for an account's graduation to the real network**
Rules need to be transparent and publicly known — otherwise it looks like an arbitrary admin decision:
- A minimum account age (e.g., 3-6 months)
- A minimum number of reports confirmed by **diverse** (see section 2a — anti-collusion) independent users
- A trust rating above a threshold, with no serious violations/sanctions during the period
- No instances of retroactive report annulment during that time
- Graduation can happen individually as conditions are met (rather than waiting for the whole protocol to "mature" at once) — which is more sensible than a single mass cutover

**Network-wide transition: testnet → mainnet**
- In parallel, the protocol itself should have a separate "public testnet" stage — a period when the network is open but its economy is still officially in demo mode for everyone, while the team and community look for bugs, exploits in the mining formulas, and holes in the anti-collusion mechanisms
- Moving the whole protocol to mainnet is a separate decision (third-party code audit + no critical incidents over a control period), not an automatic timer

**Tokenomics: separating the two accrual sources (reports vs. storage)**
To avoid confusion later about "what exactly are people earning coins for":
- Keep a **separate internal ledger** per source (report-mining and storage-mining) — each with its own emission formula and its own daily/weekly cap, even though the user sees one combined balance in the interface
- This separation matters so either source can be tuned or disabled independently without breaking the other (e.g., if storage-mining turns out too easy to farm, only its coefficient needs adjusting)
- On testnet this separation is especially useful: a bug in one source's formula can be rolled back/zeroed out without touching the other source's accrual
- A user's total balance = report_balance + storage_balance, but the history/audit log must always be able to decompose it back into its components — both for transparency to the user and as a technical necessity for debugging and retroactive sanctions

---

## 6. Roadmap (high level)

| Phase | Content |
|---|---|
| 1. MVP (1 region) | Mobile app (Flutter/React Native): submit a report with photo and geo, map, basic community verification, anonymous submission, **crypto testnet active from day one** (report mining, separate source tracking) |
| 2. Security | Tor mirror for the web version, encrypted attachments, metadata scrubbing |
| 3. Web version | Public read-only report map in the browser, shared API layer with the mobile app |
| 4. Federation | Independent nodes by region/country |
| 5. Storage-mining | Integrate Storj/Filecoin as a storage backend, second accrual source (section 4a) — also testnet first |
| 6. Mainnet transition | Code audit, control period with no critical incidents; individual account graduation per the criteria in section 5a |
| 7. Scale | Volunteer local moderators, translations, donation infrastructure across multiple platforms |

---

## 7a. An "AI plug" (architectural stub for the future)

The idea: don't wire in a specific AI model now, but design the system from the start so any model — paid, free, self-hosted, third-party — can be plugged in and unplugged without reworking the core.

**How to do this technically — the adapter pattern**
- Verification/moderation code shouldn't call a specific AI service directly; it should go through an abstract internal interface, e.g. `AIVerificationProvider`, with methods like "assess a photo for signs of tampering," "check report text for spam/duplicates," "translate a report into another language"
- The concrete implementation of this interface is a pluggable module (adapter): today it might be an empty stub ("feature unavailable, running without AI"), tomorrow a call to an open model (Llama, Mistral, etc. — self-hostable, open source), the day after a paid API (Claude, GPT), and if someone offers a grant/free access to their models, that's yet another adapter for their API
- The key point: switching between "no AI" / "our own model" / "a third-party paid API" is a configuration choice, not a change to the rest of the system

**Where AI could genuinely help in this project (not necessarily all at once)**
- Automatic text pre-moderation (spam, toxicity, duplicates) — already mentioned (Detoxify), effectively the first AI adapter
- Analyzing photos/videos for signs of photoshopping/deepfakes — assists verification, doesn't replace crowdsourced confirmation
- Detecting anomalies in the confirmation graph (section 2a, anti-collusion) — a classic task where ML can strengthen, not replace, statistical heuristics
- Automatic translation of reports between languages — important at global scale, so a report from one country is understandable to moderators in another
- Clustering similar reports (same event, reported by different people) — reduces moderator workload

**Principle of use — AI as an assistant, not a judge**
Since a faulty auto-verification could either block a genuine informant or let a fabricated report through, an AI assessment should enter the system as one signal among others (alongside trust rating, confirmation diversity, etc.), not as a final "true/false" verdict. The final weight always comes from combining several independent sources — the same rule as in section 2a on collusion protection.

---

## 8. Authentication and protection against multi-accounting

This is in direct tension with what we decided in the informant-safety section ("anonymous submission by default") — the more data required at registration, the safer against fake accounts, but the less anonymous and the scarier for a genuine informant. The solution is different requirements for different access tiers, not a single bar for everyone.

**Tier 0 — submitting a report with no account at all**
- It should stay possible to submit a report with no registration at all (just a human/anti-bot check) — for the case where someone is in genuine danger and doesn't want to reveal even an email
- Such reports have minimal weight by default and require more independent confirmations to reach "confirmed" status

**Tier 1 — a regular account**
- Minimum data: a username/pseudonym + password (or passkey/OAuth via open providers) — no real name
- Lets someone confirm other people's reports and build up a trust rating, but with limited voting weight

**Tier 2 — verified account (needed for full mining, see section 5)**
- This is where protection against "50 accounts, one person" is needed — a phone number is the most practical option among email/phone/username-password alone, because:
  - Email can be created in batches, for free, anonymously (dozens in a minute)
  - A phone number costs money/effort to obtain at scale (even virtual numbers have a cost and carrier-imposed limits) — a natural economic barrier against account farming
  - Just a username+password gives no protection against duplicates at all
- Important for privacy: the phone number is **never stored in plain text** — only an irreversible salted hash is stored, so the system can check "has this number already been used to register" without being able to recover the original number from the database
- One number = one "verified slot" system-wide (including across testnet and mainnet)

**Additional layers of protection (on top of phone verification, not instead of it)**
- Device fingerprinting — if many "verified" accounts suddenly log in from the same device/IP subnet, that's a signal for the collusion graph (section 2a), leading to reduced weight rather than an outright block
- Progressive rate limits — a newly verified account can't immediately post/confirm at full capacity; the limit grows over time (the same logic as mining vesting)
- Optionally, in the future — open-protocol proof-of-personhood services (e.g., World ID or similar) as an alternative to a phone number where a number isn't available/desirable — but this can be deferred; starting with a phone number is simpler

**Bottom line on the privacy/anti-fraud tradeoff**
- An informant in real danger can submit a report with no phone number and no account at all (tier 0) — their safety matters more than fighting fraud at this level
- A phone number is only needed for those who want to fully earn mining rewards — which is fair: the greater the potential monetary upside, the higher the verification bar, and this directly reduces the economic incentive to build account farms

**Voting weight by verification tier (separate from trust rating)**
Two different concepts that are easy to conflate need to stay distinct:
- **Trust rating** (section 2) — earned through actions: how many reports were confirmed, how many times the account was wrong
- **Identity verification tier** (this section) — not earned through activity; determined by how much personal data someone has provided

Both should act together, not replace each other — verification tier sets a **ceiling** on influence, while trust rating determines how much of that ceiling a person has actually reached:

| Tier | What was provided | Ceiling on voting weight for confirming/submitting a report |
|---|---|---|
| 0 — no account | nothing | minimal, barely affects a report's status alone |
| 1 — login + password | nothing but a made-up name | a low ceiling, even with a perfect trust rating — can't single-handedly tip the system |
| 2 — phone | a number (which cost something with the carrier) | a medium ceiling — with a high trust rating, can meaningfully affect verification |
| 3 — full verification (future, passport/ID) | an identity document | a high ceiling — such votes carry more weight than others, all else equal |

So someone at "login + password," even if they somehow built up a high trust rating, physically cannot single-handedly force through or tank a report's verification — their tier's ceiling won't allow it. Users verified by phone, or (in the future) by document, naturally carry more influence, because confirming identity itself reduces the risk that the account is fake.

This also directly strengthens the anti-collusion defense (section 2a): even 30 anonymous "tier 1" accounts working together won't add up to the weight of a handful of phone-verified people — farming anonymous accounts becomes economically pointless, not just statistically suspicious.

---

*Inspiration for the architecture: Mastodon (federation), SecureDrop (informant safety), Ushahidi (crowdsourced incident reporting — a very closely related open source project, worth studying its code directly).*

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-09-13 | First English baseline. Consolidates: project scope, architecture, verification model, collusion protection, informant safety, storage-mining, crypto/mining model, testnet, roadmap, AI adapter pattern, auth tiers, name decision (Corvyn), all risk analysis (section 0) |
