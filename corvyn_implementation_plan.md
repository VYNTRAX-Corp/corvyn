# Corvyn - Professional Implementation Plan

**Version:** 1.0  
**Date:** 2026-09-19  
**Status:** Implementation baseline for the Lithuania-first MVP

## 1. Purpose and governing decisions

This document converts the Corvyn product, safety, and development-context documents into an executable implementation plan. It defines the order of work, modular boundaries, data contracts, quality gates, and release criteria.

The plan is intentionally designed for a solo developer: each phase produces a usable increment, infrastructure is kept small, and existing open-source components are preferred over custom infrastructure.

### 1.1 Authoritative scope

The current development context is authoritative when it conflicts with the older project plan:

- MVP includes anonymous reporting, account registration/login, report submission, map, community confirmation, trust rating, face blurring, metadata stripping, emergency disclaimer, and Lithuanian/English/Russian localization.
- Cryptocurrency, mining, phone verification, federation, storage-mining, web application, device fingerprinting, and AI moderation are deferred.
- The backend must enforce privacy and moderation rules. Client-side checks are not sufficient.

The architecture will leave explicit ports and extension points for deferred capabilities without implementing them in the MVP.

### 1.2 Recommended technology baseline

| Area | Decision |
|---|---|
| Mobile | Flutter, Dart |
| Backend | Node.js + NestJS + TypeScript |
| Database | PostgreSQL + PostGIS |
| Cache and jobs | Redis + BullMQ |
| Object storage | MinIO, S3-compatible API |
| Reverse proxy/TLS | Caddy or Traefik |
| Local development | Docker Compose |
| MVP hosting | Hetzner or OVH, EU region |
| API contract | OpenAPI generated from NestJS DTOs |
| Authentication | Short-lived access token + rotated refresh token |
| Localization | Flutter `intl` or `easy_localization`; no hardcoded user-facing strings |
| Observability | Structured logs, health endpoints, error tracking, metrics |

The recommendation is NestJS rather than FastAPI because TypeScript provides one language for backend contracts, validation, shared generated models, and future tooling while NestJS supplies clear module, dependency-injection, guard, interceptor, and testing conventions.

## 2. Product boundaries

### 2.1 MVP user journeys

1. First launch: language selection and mandatory emergency-services disclaimer.
2. Anonymous user: choose a location, category, description, media, and submit without an account.
3. Account user: register with pseudonym and password, log in, submit and confirm reports.
4. Map user: view nearby reports, open a report, inspect confidence/status, and submit one confirmation.
5. Reporter: receive clear feedback that media is processed, faces/license plates are blurred by default, and metadata is removed.
6. Moderator: review high-risk reports, official-source evidence, appeals, and enforcement actions.

### 2.2 MVP categories

Start with a small, server-configured catalog:

- `road_hazard`: road hazard or public emergency; lower verification threshold.
- `fire_or_accident`: fire, collision, or immediate public danger; emergency disclaimer required.
- `environmental_hazard`: spill, pollution, or unsafe environmental condition.
- `named_person_or_organization`: accusation involving a named person or organization; highest threshold and moderation hold.

Categories must be data-driven rather than compiled into screens. Adding a category should require configuration and translations, not a rewrite of report logic.

### 2.3 Explicit non-goals

Do not implement in this plan's MVP:

- cryptocurrency, mining, token balances, or mainnet/testnet;
- phone, identity-document, or email verification;
- federation or ActivityPub;
- public web client;
- AI decision-making;
- device fingerprinting or invasive tracking;
- exact-address publication;
- automatic publication of named-person accusations.

## 3. Architecture principles

### 3.1 Modular monolith first

Use a modular monolith for the MVP. It keeps deployment and debugging manageable while enforcing boundaries that can later become services.

Each backend module owns:

- domain entities and invariants;
- application use cases;
- persistence adapters;
- HTTP controllers and DTO mapping;
- module-specific authorization rules;
- tests.

Modules communicate through application interfaces and domain events, not by reaching into another module's repository or database tables.

### 3.2 Dependency direction

```
HTTP/controller -> application/use case -> domain
                         |
                         +-> port/interface -> infrastructure adapter
```

The domain must not import NestJS, Prisma/TypeORM, Redis, S3, or HTTP clients. Infrastructure implements ports declared by the application/domain layers.

### 3.3 Privacy by design

- Store only data needed for the product.
- Keep anonymous reports unlinked to an account.
- Never use EXIF location as the public report location.
- Store public approximate coordinates separately from any short-lived processing input.
- Make moderation policy server-side and fail closed for high-risk content.
- Do not log report text, media URLs, tokens, passwords, or raw anti-bot secrets.

### 3.4 Stable extension points

Define interfaces now, implement only what the MVP needs:

- `MediaProcessor`: metadata stripping and face/license-plate blurring.
- `OfficialSourceVerifier`: initially manual/no-op workflow; no AI lookup.
- `ModerationPolicy`: deterministic server-side policy engine.
- `NotificationPort`: initially in-app/API status only; push can be added later.
- `LedgerPort`: reserved for future reputation/crypto separation, not wired to MVP behavior.

## 4. Repository structure

Use a repository layout that separates deployable applications from shared contracts and operational configuration:

```
corvyn/
  apps/
    mobile/
    api/
    worker/
  packages/
    api-contracts/
    generated-client/
    lint-config/
  infra/
    docker/
    migrations/
    monitoring/
    caddy/
  docs/
    architecture/
    api/
    operations/
  .github/
    workflows/
```

### 4.1 Flutter structure

```
apps/mobile/lib/
  app/
    bootstrap/
    routing/
    theme/
    localization/
  core/
    network/
    storage/
    errors/
    permissions/
    widgets/
  features/
    onboarding/
    auth/
    map/
    reports/
    confirmations/
    profile/
  shared/
    models/
    validators/
```

Each feature follows:

```
feature/
  data/
    datasources/
    dto/
    repositories/
  domain/
    entities/
    repositories/
    usecases/
  presentation/
    pages/
    controllers/
    widgets/
```

Use one state-management approach consistently. Recommended: Riverpod with immutable state and explicit loading/error/success states.

### 4.2 NestJS structure

```
apps/api/src/
  main.ts
  app.module.ts
  config/
  common/
    auth/
    errors/
    logging/
    validation/
    pagination/
  modules/
    users/
    auth/
    categories/
    reports/
    media/
    confirmations/
    trust/
    moderation/
    appeals/
    audit/
    health/
  infrastructure/
    database/
    object-storage/
    queues/
    anti-bot/
```

The worker uses the same application contracts but runs media and asynchronous jobs without exposing public HTTP endpoints:

```
apps/worker/src/
  jobs/media-processing/
  jobs/report-recalculation/
  jobs/cleanup/
```

## 5. Core domain model

Use UUIDs for externally visible identifiers. Use UTC timestamps. Add `created_at`, `updated_at`, and an immutable audit reference where appropriate.

### 5.1 Users and sessions

`users`

- `id`
- `pseudonym` (unique, normalized)
- `password_hash`
- `trust_score`
- `verification_tier` (MVP values: `0` anonymous, `1` account)
- `status` (`active`, `restricted`, `banned`)
- `locale`
- `created_at`, `updated_at`

`refresh_sessions`

- `id`
- `user_id`
- hashed refresh-token identifier
- expiry and revocation timestamps
- creation metadata minimized and retention-limited

Anonymous submissions must not create a user row.

### 5.2 Categories

`report_categories`

- `id`, `code`
- localized display keys
- `threat_level`
- `requires_emergency_disclaimer`
- `verification_policy`
- `requires_moderator_review`
- enabled flag

### 5.3 Reports

`reports`

- `id`
- nullable `author_id`
- category ID
- lifecycle status: `unverified`, `community_confirmed`, `debunked`, `outdated`, `removed`
- moderation status: `not_required`, `pending`, `approved`, `redacted`, `rejected`
- public approximate PostGIS point
- geospatial precision/radius metadata
- title/description
- `contains_person_claim`
- `person_identity_published` (must default false)
- `official_source_status`
- `published_at`, `expires_at`
- `created_at`, `updated_at`

Store report text as submitted and as sanitized/published representations only if required. Never expose the raw representation for a report that has been redacted.

### 5.4 Media

`media_assets`

- `id`, `report_id`
- object-storage key for private processing object
- object-storage key for public derivative
- media type and dimensions/duration
- processing status
- `faces_blurred`
- `license_plates_blurred`
- `exif_stripped`
- checksum
- failure reason visible to authorized operators
- retention/deletion timestamps

The public API must return only the processed public derivative.

### 5.5 Confirmations and trust

`confirmations`

- `id`, `report_id`
- nullable `user_id` for anonymous confirmation if enabled
- one of `confirm`, `dont_see`, `outdated`
- weight snapshot used for the decision
- created timestamp
- unique constraint preventing repeated active votes by the same actor/report

`trust_events`

- immutable event ID
- user ID
- report/confirmation reference
- signed reason code
- score delta
- created timestamp

Calculate current trust from events or maintain a cached value with reconciliation. Never update trust without an auditable event.

### 5.6 Moderation and appeals

`moderation_cases`

- report/media reference
- risk reason
- state
- assigned moderator
- decision and public-safe reason
- timestamps

`appeals`

- case/report reference
- requester identity where available
- statement
- state and decision
- timestamps

`audit_events`

- actor type and optional actor ID
- action
- target type and ID
- reason code
- metadata minimised and redacted
- timestamp

## 6. Backend modules and responsibilities

### 6.1 `AuthModule`

- registration with pseudonym/password;
- login, logout, refresh-token rotation;
- password hashing with Argon2id;
- account status checks;
- anonymous actor/session support without identity persistence;
- rate limits and anti-bot integration.

### 6.2 `UsersModule`

- profile and locale;
- trust-score summary;
- restrictions and account lifecycle;
- no sensitive identity collection in MVP.

### 6.3 `CategoriesModule`

- read enabled category definitions;
- return localized labels and policy flags;
- administrative seed/update path protected separately.

### 6.4 `ReportsModule`

- validate report input;
- approximate coordinates on the server;
- create report draft and submit transaction;
- enforce anonymous tier availability;
- retrieve nearby reports with PostGIS;
- return redacted public projections;
- expire or mark reports outdated.

### 6.5 `MediaModule`

- issue constrained upload requests;
- accept only allowed media types and sizes;
- enqueue processing;
- expose processing status;
- publish only processed derivatives;
- delete failed/temporary objects.

### 6.6 `ConfirmationsModule`

- confirm, don't-see, and outdated actions;
- enforce one active action per actor/report;
- calculate effective weight using tier and trust ceiling;
- publish a recalculation event;
- reject actions on removed or closed reports.

### 6.7 `TrustModule`

- apply deterministic score changes;
- record immutable trust events;
- cap and rate-limit changes;
- reconcile cached score from events.

### 6.8 `ModerationModule`

- deterministic risk classification;
- enforce R1 for named-person/organization claims;
- hold high-risk reports before public identity-bearing publication;
- redact names/faces from public projections;
- moderator decision workflow;
- no automatic identity matching in MVP.

### 6.9 `AppealsModule`

- accept appeals from eligible reporters;
- prevent duplicate open appeals;
- route to a moderator;
- preserve original decision and decision history.

### 6.10 `AuditModule`

- immutable security and moderation events;
- operator access logging;
- retention policy and restricted access.

## 7. API contract

Version all public endpoints under `/v1`. Generate OpenAPI from the backend and generate the Flutter client from the contract where practical.

### 7.1 Public/auth endpoints

```
GET    /v1/health
GET    /v1/categories
POST   /v1/auth/register
POST   /v1/auth/login
POST   /v1/auth/refresh
POST   /v1/auth/logout
GET    /v1/me
```

### 7.2 Report endpoints

```
GET    /v1/reports?bbox=&category=&status=&cursor=
GET    /v1/reports/:id
POST   /v1/reports
POST   /v1/reports/:id/media/upload-intent
GET    /v1/reports/:id/media/:mediaId/status
POST   /v1/reports/:id/confirmations
POST   /v1/reports/:id/appeals
```

Use cursor pagination, bounding-box limits, response field projections, and server-side maximum radius. Never accept arbitrary SQL-like filters.

### 7.3 Response and error standards

Use one envelope for errors:

```json
{
  "error": {
    "code": "REPORT_REQUIRES_MODERATION",
    "message": "This report is awaiting review.",
    "requestId": "..."
  }
}
```

Expose stable machine-readable codes and localized client messages. Do not expose moderation heuristics that would help bypass them.

## 8. Media and privacy pipeline

Media processing is a release blocker, not a later enhancement.

1. Client selects/captures media and requests an upload intent.
2. API validates actor, size, MIME, category, and rate limits.
3. Client uploads to a private MinIO quarantine bucket using a short-lived signed URL.
4. API enqueues a `media.process` job.
5. Worker verifies file signature, strips EXIF and other metadata, normalizes media, and detects faces/license plates.
6. Worker applies default blur; self-report override, if later supported, must be an explicit server-authorized policy path.
7. Worker writes a public derivative to a separate bucket and updates processing flags.
8. Report becomes publishable only when all required media is processed successfully.
9. Failed or abandoned quarantine objects are deleted by a scheduled cleanup job.

For video, define an MVP limit (duration, size, formats) and process frames at a documented sampling policy. If reliable video blurring is not available, reject the video rather than publish an unprocessed derivative.

## 9. Moderation and safety enforcement

### 9.1 R1: named-person/organization accusations

The server must:

- classify the category and explicit claim fields;
- require moderator review for named-person/organization reports;
- keep identity-bearing text/media private until approved;
- publish only an incident-level, de-identified projection by default;
- require an official-source reference and human approval before identity can be published;
- record the decision and reason in the audit log.

The mobile app may warn the user, but it must never be the only enforcement layer.

### 9.2 R2: face and plate blurring

Default processing is blurred. A media record cannot be marked public unless `faces_blurred=true` and `exif_stripped=true` for applicable media. License-plate blurring is included because it is part of the user rules and privacy risk.

### 9.3 R3: emergency disclaimer

The disclaimer must be:

- shown on first launch before normal use;
- shown again before submitting a life-threatening report;
- localized in Lithuanian, English, and Russian;
- acknowledged through an explicit action;
- backed by automated UI tests.

The API also stores the category policy and rejects submission metadata that claims disclaimer acknowledgement when the required acknowledgement is absent.

### 9.4 R4: location and metadata

- Public map points are quantized or radius-obscured on the server.
- Exact capture coordinates are never used as the public point.
- EXIF and embedded metadata are stripped before public storage.
- Logs and analytics must not contain exact location or raw media metadata.

### 9.5 R5: anonymous access

Anonymous report submission remains a first-class route in API authorization and UI navigation. Regression tests must verify it after every auth, rate-limit, and moderation change.

## 10. Flutter implementation sequence

### 10.1 Application shell

Build theme, routing, localization, error presentation, connectivity handling, permission prompts, and dependency injection before feature screens.

### 10.2 Onboarding

- language selection;
- emergency disclaimer;
- privacy explanation;
- anonymous continue action;
- optional account login/register action.

### 10.3 Map

- permission-aware map;
- approximate current location;
- bounded viewport query;
- report markers by category/status;
- loading, empty, offline, and error states;
- tap marker to report detail;
- submission entry point.

### 10.4 Report composer

- category selection driven by API;
- localized field labels and validation;
- location selection and approximation indicator;
- media picker/camera;
- processing progress and retry;
- emergency disclaimer gate;
- named-person warning and moderation explanation;
- anonymous/account submission path.

### 10.5 Report detail and confirmations

- safe public projection;
- status/confidence explanation;
- processed media only;
- confirm/don't-see/outdated actions;
- action state and idempotency handling;
- report appeal entry where eligible.

### 10.6 Account/profile

- register/login/logout;
- pseudonym and locale;
- trust summary and event explanations;
- restrictions and appeal status;
- no phone/email requirement in MVP.

## 11. Delivery phases and gates

### Phase A - product and legal readiness

Deliverables:

- final MVP scope and category catalog;
- Lithuanian legal/privacy review plan;
- emergency number and disclaimer copy;
- retention/deletion policy;
- moderation policy and appeal rules;
- abuse and incident-response procedure.

Gate: no implementation of identity-bearing publication until R1 policy is approved.

### Phase B - repository and developer foundation

Deliverables:

- monorepo/workspace setup;
- formatting, linting, type checks;
- commit hooks and CI;
- Docker Compose for PostgreSQL/PostGIS, Redis, and MinIO;
- environment schema validation;
- health endpoints and seed command.

Gate: a new developer can run API, worker, database, and mobile tests from documented commands.

### Phase C - persistence and contracts

Deliverables:

- migrations and indexes;
- category seed data;
- OpenAPI contract;
- generated client baseline;
- error and pagination conventions;
- audit-event primitives.

Gate: migrations are repeatable, reversible where safe, and tested against a clean database.

### Phase D - authentication and anonymous access

Deliverables:

- registration/login/refresh/logout;
- Argon2id password hashing;
- session revocation;
- anonymous actor flow;
- anti-bot and rate-limit integration;
- authorization tests.

Gate: anonymous submission works without creating a user identity; banned accounts cannot act.

### Phase E - report creation and map read path

Deliverables:

- report validation and creation;
- coordinate approximation;
- PostGIS nearby query;
- map marker API;
- report detail safe projection;
- Flutter map and composer skeleton.

Gate: a report can be submitted and displayed without leaking exact metadata or identity.

### Phase F - media processing

Deliverables:

- signed uploads;
- quarantine/public buckets;
- worker pipeline;
- EXIF stripping;
- face/plate blur;
- processing retry/failure states;
- cleanup job.

Gate: no unprocessed media can reach public API or public bucket.

### Phase G - confirmations and trust

Deliverables:

- confirmation endpoints/UI;
- idempotency and duplicate prevention;
- deterministic thresholds;
- trust events and score cache;
- outdated-report handling.

Gate: repeated votes cannot inflate status or trust, and every score change is auditable.

### Phase H - moderation and appeals

Deliverables:

- server-side R1 policy;
- moderation queue and protected projections;
- approval/redaction/rejection;
- appeal submission and decision history;
- moderator audit trail.

Gate: high-risk reports are never publicly identity-bearing before human approval.

### Phase I - localization and accessibility

Deliverables:

- complete `lt`, `en`, and `ru` strings;
- plural/date/number formatting;
- translated safety and error messages;
- screen-reader labels;
- adequate contrast and text scaling;
- locale fallback tests.

Gate: no user-visible hardcoded strings and all critical safety flows translated.

### Phase J - integration, security, and release candidate

Deliverables:

- end-to-end test environment;
- migration backup/restore rehearsal;
- load tests for map reads and uploads;
- dependency and container scans;
- privacy review;
- crash/error dashboards;
- App Store/Google Play compliance materials.

Gate: all release criteria in section 15 pass.

### Phase K - controlled pilot

Deliverables:

- one Lithuanian pilot region;
- moderator roster and escalation;
- support channel;
- feature flags and kill switches;
- daily backup verification;
- incident review cadence.

Gate: pilot metrics and safety incidents are reviewed before expansion.

## 12. Testing strategy

### 12.1 Backend

- unit tests for domain policies and trust calculations;
- repository integration tests with PostgreSQL/PostGIS;
- API contract tests from OpenAPI;
- authorization matrix tests;
- media-worker tests using fixture files;
- property tests for coordinate approximation and thresholds;
- migration tests from empty and representative prior schema.

### 12.2 Flutter

- unit tests for validators, mappers, and state transitions;
- widget tests for disclaimer, anonymous submission, processing states, and error recovery;
- golden tests for critical privacy/safety surfaces where stable;
- integration tests for login, map, report, media, and confirmation journeys;
- localization completeness checks.

### 12.3 Mandatory safety regression tests

1. Anonymous user can submit a permitted report.
2. Life-threatening submission requires disclaimer acknowledgement.
3. Named-person report is held/redacted before approval.
4. Public media has stripped metadata and required blur flags.
5. Exact source coordinates are not returned by public endpoints.
6. Removed reports and failed media are not publicly retrievable.
7. Duplicate confirmations do not change trust twice.
8. Banned/restricted users cannot bypass limits through refresh tokens.

## 13. Security and privacy controls

- Argon2id with reviewed parameters and password-length policy.
- TLS everywhere outside local development.
- Secrets only through environment/secret management, never source control.
- MinIO buckets private by default; signed URLs short-lived.
- Strict MIME/signature validation and decompression/resource limits.
- Request IDs, structured logs, and redacted error payloads.
- Rate limits per route class; stronger limits for uploads and confirmations.
- CSRF protection if cookie-based auth is used; otherwise keep token handling out of logs and URLs.
- Database roles separated for API, worker, migration, and read-only operations.
- Encrypted backups with tested restore.
- Dependency pinning, automated updates, and vulnerability review.
- Data retention jobs for sessions, quarantine files, and operational logs.
- Access review for moderators and operators.

Do not introduce device fingerprinting, raw IP retention, or phone collection into the MVP without a separate privacy and product decision.

## 14. Operations and deployment

### 14.1 Environments

- `local`: Docker Compose, seeded test data.
- `test`: CI-managed ephemeral or dedicated environment.
- `staging`: production-like infrastructure with synthetic data only.
- `production`: EU-hosted pilot with restricted operator access.

### 14.2 Deployment units

- API container;
- worker container;
- PostgreSQL/PostGIS;
- Redis;
- MinIO;
- reverse proxy;
- monitoring/logging components.

Use one deployable stack initially. Split services only when a measured operational bottleneck justifies it.

### 14.3 Backups and recovery

- daily encrypted PostgreSQL backups;
- MinIO replication or scheduled backup of public and quarantine policy-required objects;
- documented restore procedure;
- monthly restore drill;
- defined RPO/RTO before pilot;
- database migration backup before every production migration.

### 14.4 Observability

Track:

- API latency/error rate by route;
- queue depth and media processing duration/failure rate;
- report creation and publication outcomes;
- confirmation errors and duplicate attempts;
- database health and storage capacity;
- crash-free sessions;
- moderation queue age;
- privacy/safety incident counters.

Never use report text, raw media, exact coordinates, or authentication secrets as metric labels.

## 15. MVP release criteria

The MVP is ready for a controlled pilot only when:

- all MVP journeys work on supported iOS and Android versions;
- anonymous reporting works end to end;
- login/account reporting works end to end;
- all three locales cover critical flows;
- emergency disclaimer is unavoidable and translated;
- media processing is fail-closed;
- R1 is enforced server-side and tested;
- public location is approximate;
- EXIF is stripped before publication;
- report status and confirmation logic are deterministic and auditable;
- rate limits and abuse handling are active;
- backups and restoration are verified;
- monitoring and incident response are operational;
- legal/privacy copy has been reviewed for Lithuania;
- no critical/high unresolved security findings remain.

## 16. Pilot metrics and feedback loop

Measure product health without collecting unnecessary personal data:

- report submission completion rate;
- median time from upload to processed publication;
- percentage of reports requiring moderation;
- confirmation participation and duplicate-action rate;
- false-positive/false-negative moderation appeals;
- crash-free sessions;
- API and worker reliability;
- storage and infrastructure cost per active region;
- number and severity of safety/privacy incidents.

Review metrics weekly during the pilot. Every policy or threshold change must include a migration/configuration note, test updates, and an audit entry.

## 17. Deferred roadmap after MVP

Implement only after the MVP is stable and legally reviewed:

1. Public read-only web map using the same API.
2. Better moderator tooling and regional workflows.
3. Optional notification system.
4. Privacy-preserving anti-abuse improvements with legal review.
5. Federation design and threat model.
6. Storage-mining integration as a separate subsystem.
7. Reputation/ledger experiments in a non-monetary test environment.
8. Phone verification only when a documented product need and privacy basis exist.
9. AI adapters as advisory signals, never final moderation decisions.
10. Mainnet or exchangeable assets only after independent legal, economic, and security review.

## 18. Definition of done for each feature

A feature is complete only when:

- domain rules and authorization are implemented server-side;
- mobile UI handles loading, empty, offline, error, and success states;
- translations exist for `lt`, `en`, and `ru`;
- database migrations and indexes are included;
- API contract and generated client are updated;
- unit, integration, and relevant end-to-end tests pass;
- logs and metrics are safe and useful;
- documentation and operational notes are updated;
- privacy, moderation, and anonymous-access regressions are covered;
- the feature is deployable behind a flag if pilot risk warrants it.

## 19. First implementation backlog

1. Confirm the MVP scope conflict resolution recorded in this document.
2. Create the monorepo and CI baseline.
3. Bootstrap NestJS API, worker, and Flutter shell.
4. Add Docker Compose services and validated configuration.
5. Add database migrations, category seed, and health checks.
6. Implement authentication and anonymous actor flow.
7. Implement report creation and approximate map queries.
8. Implement media quarantine and processing pipeline.
9. Implement report detail and safe public projections.
10. Implement confirmations and trust events.
11. Implement moderation queue, R1 policy, and appeals.
12. Complete localization/accessibility.
13. Run security/privacy review and release-candidate testing.
14. Deploy staging, rehearse recovery, and run the controlled pilot.

This sequence keeps the core product usable early, protects the non-negotiable safety rules, and prevents future capabilities from contaminating the maintainability of the MVP.

