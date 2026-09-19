CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS report_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label_key TEXT NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('low', 'high')),
  requires_emergency_disclaimer BOOLEAN NOT NULL DEFAULT FALSE,
  requires_moderator_review BOOLEAN NOT NULL DEFAULT FALSE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
