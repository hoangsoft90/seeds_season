## Purpose

Add a passive progress tracker and emotional milestone badges to My Garden, so users see their plants growing over time. Progress is calculated on-the-fly from `planted_at` + crop `timeline_base` — no extra storage needed.

## ADDED Requirements

### Requirement: Plant progress display
The system SHALL show a progress bar and current growth stage for every "growing" plant in the garden, calculated from the planting date and the crop's `growth_stages` timeline.

#### Scenario: Show progress for a young plant
- **WHEN** a user views their garden and a crop was planted 5 days ago with germination_days [3, 7]
- **THEN** the progress bar shows ~14% progress and the stage label says "Đang nảy mầm"

#### Scenario: Show progress for a mature plant
- **WHEN** a crop was planted 28 days ago with days_to_harvest [25, 35]
- **THEN** the progress bar shows ~80% and the stage label says "Sắp thu hoạch"

### Requirement: Milestone badges
The system SHALL display milestone badges when a plant crosses a growth stage boundary: "🌱 Nảy mầm!" (germination end), "🌿 Lớn lên!" (seedling start), "🎉 Sắp thu hoạch!" (harvest stage, ≤5 days remaining).

#### Scenario: Germination milestone
- **WHEN** a plant's days since planting first exceeds `germination_days[1]`
- **THEN** a "🌱 Nảy mầm!" badge appears above the progress bar

#### Scenario: Harvest-ready milestone
- **WHEN** a plant enters the harvest stage (≤5 days to max harvest)
- **THEN** a "🎉 Sắp thu hoạch!" badge appears

### Requirement: Harvest action
The system SHALL let a user mark a growing plant as "harvested" when progress ≥ 80%, recording `harvested_at` timestamp. Harvested plants appear in a separate "Đã thu hoạch" section, distinct from ghost plants.

#### Scenario: Harvest a plant
- **WHEN** a user taps "🎊 Thu hoạch" on a plant with progress ≥ 80%
- **THEN** the plant moves to the "Đã thu hoạch" section with `harvested_at` set to now

#### Scenario: Cannot harvest too early
- **WHEN** a user has a plant with progress < 80%
- **THEN** the harvest button is not shown
