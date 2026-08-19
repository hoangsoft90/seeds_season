# Onboarding

## Purpose

Zero-friction onboarding for beginner urban growers: choose location (city or GPS), optional goal, and a one-tap micro-climate proxy, then immediately see a two-tier recommendation — "Good for your area" after location and "Best for your balcony" after micro-climate — without creating an account.

## Requirements

### Requirement: Location selection
The system SHALL let the user pick a city (Hanoi / Ho Chi Minh City / Da Lat) or use GPS to resolve the nearest climate region, with manual selection always available and GPS failure handled gracefully.

#### Scenario: City picked
- **WHEN** the user taps a city
- **THEN** the region is set and Level 1 recommendations load for the current month

#### Scenario: GPS unavailable or denied
- **WHEN** GPS is unsupported, denied or times out
- **THEN** the user is shown a message and can pick a city manually

### Requirement: Optional goal question
The system SHALL offer three optional goals (fastest harvest, easy care, daily food) that the user may skip, and SHALL recompute Level 2 when the goal changes.

#### Scenario: Goal selected
- **WHEN** the user picks a goal and a micro-climate is already chosen
- **THEN** Level 2 recomputes using the goal's weight set

#### Scenario: Goal skipped
- **WHEN** the user skips the goal question
- **THEN** recommendations use the default weight set

### Requirement: Micro-climate proxy
The system SHALL map one of three one-tap icons (window, balcony/terrace, garden) to default location type, sunlight hours and pot depth, and SHALL use these values for Level 2.

#### Scenario: Icon tapped
- **WHEN** the user taps a micro-climate icon
- **THEN** Level 2 recommendations load with the mapped proxy values

### Requirement: Two-tier display
The system SHALL show Level 1 "🌍 Good for your area" immediately after location selection and Level 2 "🪴 Best for your balcony" after micro-climate selection, with labels that make clear Level 1 is area-level and Level 2 is personalized.

#### Scenario: Both tiers visible
- **WHEN** location and micro-climate are both chosen
- **THEN** both tiers are displayed with distinct labels and an explanation of their basis

### Requirement: No-match display
The system SHALL display the no-match advisory message instead of an empty or forced list when the API returns no_match.

#### Scenario: Harsh conditions
- **WHEN** the API returns a no-match response
- **THEN** the user sees the advisory message in a warning panel

### Requirement: Add-to-garden placeholder
The system SHALL provide an "add to garden" action on each crop card that acts as a placeholder until Phase 1.5, when accounts and My Garden ship.

#### Scenario: Add tapped
- **WHEN** the user taps add-to-garden on a crop card
- **THEN** a notice explains the feature arrives in Phase 1.5
