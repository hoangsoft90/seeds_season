## Purpose

A deterministic, rule-based first aid flow: when a plant shows a problem, the user answers a short branching checklist of hard-coded questions and receives a concrete diagnosis plus step-by-step remedy. No AI, no community, no login — the exact answer to "my plant looks sick" for a beginner before Ask Community exists.

## ADDED Requirements

### Requirement: Symptom selection
The system SHALL let the user pick a symptom from a fixed list of common problems (yellow leaves, wilting, leaf spots, pests, root rot / overwatering, slow growth).

#### Scenario: Choose a symptom
- **WHEN** the user opens First Aid and selects "lá vàng" (yellow leaves)
- **THEN** the flow starts with the first question for that symptom

### Requirement: Branching checklist
The system SHALL ask short follow-up questions (yes/no or quick choices) that narrow the diagnosis, based on hard-coded rules derived from crop data and general plant care knowledge.

#### Scenario: Yellow leaves with heavy watering
- **WHEN** the user answers that they water more than twice a day
- **THEN** the diagnosis indicates possible root rot from overwatering

#### Scenario: Yellow leaves with dry soil
- **WHEN** the user answers that the soil is dry and they water rarely
- **THEN** the diagnosis indicates underwatering instead

### Requirement: Concrete remedy
The system SHALL show a concrete, actionable remedy (stop watering for 3 days and loosen the soil, move to more sun, treat with neem, etc.) and when to seek more help.

#### Scenario: Overwatering remedy
- **WHEN** the diagnosis is root rot from overwatering
- **THEN** the remedy says to stop watering 3 days, loosen the soil, and check the pot drains

### Requirement: No login and no external calls
The system SHALL run First Aid fully client-side from static rules, without authentication or network calls.

#### Scenario: Anonymous use
- **WHEN** an anonymous user opens First Aid
- **THEN** the full flow works without signing in

#### Scenario: Works offline-capable
- **WHEN** the static rules are bundled
- **THEN** First Aid does not depend on any API request
