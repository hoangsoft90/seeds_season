# crop-detail Specification

## Purpose
Per-crop tutorial pages ("crop detail") that turn raw Schema v2 data into practical planting guidance for beginners — when to plant, where, soil, pot depth, water, spacing, harvest, common problems and growth timeline — linked from recommendation cards.

## Requirements

### Requirement: Crop detail page at /crops/[id]
The system SHALL serve a tutorial page for each crop at /crops/[id] rendering: regional planting windows, optimal conditions (temperature, sunlight, water, soil), pot depth requirement, harvest window, growth-stage timeline, and beginner notes.

#### Scenario: Known crop id
- **WHEN** a user opens /crops/cai_xanh
- **THEN** the page renders the full tutorial sections from that crop's data

#### Scenario: Unknown crop id
- **WHEN** a user opens /crops/unknown
- **THEN** a 404 is returned

### Requirement: Navigation from recommendation cards
The system SHALL link each recommendation card to its crop detail page.

#### Scenario: Card links to detail
- **WHEN** a user taps a crop name on a recommendation card
- **THEN** they are taken to /crops/[id] for that crop

### Requirement: Low-confidence data notice
The system SHALL show a notice on the detail page when a crop's regional or field data has low confidence, inviting the user to report results to improve the app.

#### Scenario: Low-confidence source
- **WHEN** a crop's regional source has confidence low
- **THEN** the page shows the advisory note
