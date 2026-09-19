CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code TEXT NOT NULL REFERENCES report_categories(code),
  status TEXT NOT NULL CHECK (
    status IN ('unverified', 'community_confirmed', 'debunked', 'outdated', 'removed')
  ),
  latitude NUMERIC(9, 6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC(9, 6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  location_radius_meters INTEGER NOT NULL CHECK (location_radius_meters > 0),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 5 AND 5000),
  author_type TEXT NOT NULL CHECK (author_type IN ('anonymous', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS reports_category_code_idx ON reports (category_code);
