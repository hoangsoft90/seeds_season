# kitchen-scraps-tips Specification

## Purpose
A separate "Mẹo vặt" (kitchen scraps) tab that teaches beginners how to regrow crops from kitchen scraps — green onions from their root bases, water spinach from cuttings — kept apart from the main "what to grow now" recommendation so the core USP stays clear.

## Requirements

### Requirement: Kitchen-scraps tab
The system SHALL provide a "Mẹo vặt" tab on the home page, visually separate from the recommendation sections, listing crops that can be regrown from kitchen scraps.

#### Scenario: Tab is visible
- **WHEN** the user opens the home page
- **THEN** the Mẹo vặt tab is available alongside the recommendation sections

#### Scenario: Only regrow-capable crops listed
- **WHEN** the tab is opened
- **THEN** only crops tagged regrow_from_scraps or regrow_from_cuttings appear

### Requirement: Regrow instructions
The system SHALL show short step-by-step regrow instructions for each listed crop — starting material, container and water, transplanting to soil, light, and harvest — derived from crop data plus curated tips.

#### Scenario: Green onion regrow
- **WHEN** the user opens the hành lá tip
- **THEN** the steps show regrowing from the root base, first in water then in soil

#### Scenario: Water spinach cuttings
- **WHEN** the user opens the rau muống tip
- **THEN** the steps show rooting cuttings in water before planting
