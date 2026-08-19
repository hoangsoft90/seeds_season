# Recommendations API

## Purpose

HTTP endpoint (POST /api/recommendations) that returns the Top 3 crop recommendations with a Vietnamese "Why" explanation, or a no-match response — the only API surface of the MVP, served without authentication.

## Requirements

### Requirement: POST /api/recommendations
The system SHALL accept a JSON RecommendationContext (region, month, location_type, sunlight_hours, pot_depth_cm, optional goal/experience/weather/forecast fields) and SHALL return the Top 3 recommendations, each with crop identity, role, score, harvest window and a template-based "Why" explanation in Vietnamese.

#### Scenario: Valid context returns top 3
- **WHEN** a valid context is posted to the endpoint
- **THEN** the response has status ok and lists the recommended crops with role, score and why text

#### Scenario: No-match response
- **WHEN** the context leaves no surviving candidates
- **THEN** the response has status no_match with the advisory message

#### Scenario: Invalid input is rejected
- **WHEN** region, month, location_type, sunlight_hours or pot_depth_cm are invalid
- **THEN** the response is HTTP 400 with a descriptive error message

### Requirement: No authentication required
The system SHALL serve recommendations to anonymous clients; authentication is only required for the add-to-garden action, which ships in Phase 1.5.

#### Scenario: Anonymous request
- **WHEN** an anonymous client posts a valid context
- **THEN** it receives recommendations normally

### Requirement: Audit data not exposed
The system SHALL NOT expose audit internals (full candidate list and exclusion reasons) through the public API response.

#### Scenario: Public response shape
- **WHEN** a client inspects the response body
- **THEN** it contains only the documented fields and no audit internals
