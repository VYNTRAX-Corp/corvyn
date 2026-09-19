INSERT INTO report_categories (
  code,
  label_key,
  threat_level,
  requires_emergency_disclaimer,
  requires_moderator_review
)
VALUES
  ('road_hazard', 'categories.roadHazard', 'low', FALSE, FALSE),
  ('fire_or_accident', 'categories.fireOrAccident', 'high', TRUE, FALSE),
  ('environmental_hazard', 'categories.environmentalHazard', 'high', FALSE, FALSE),
  ('named_person_or_organization', 'categories.namedPersonOrOrganization', 'high', FALSE, TRUE)
ON CONFLICT (code) DO UPDATE SET
  label_key = EXCLUDED.label_key,
  threat_level = EXCLUDED.threat_level,
  requires_emergency_disclaimer = EXCLUDED.requires_emergency_disclaimer,
  requires_moderator_review = EXCLUDED.requires_moderator_review;
