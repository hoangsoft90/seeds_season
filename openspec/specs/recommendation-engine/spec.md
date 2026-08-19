# Recommendation Engine

## Purpose

Core engine that recommends which crops a beginner urban grower in Vietnam is most likely to grow successfully right now, based on season, region and micro-climate — answering "what can I succeed at?" (North Star: First Successful Grow) rather than "what suits my climate?".

## Requirements

### Requirement: Crop data model (Schema v2)
The system SHALL model each crop with four separated groups: CropBase (static metadata), HardConstraints (life–death thresholds), GrowingRules (optimal conditions + regional rules), and BeginnerSuccessFactors, stored as one record but kept as distinct types in code.

#### Scenario: Dataset loads with all four groups
- **WHEN** the crop dataset is loaded
- **THEN** every crop record contains all four required groups
- **AND** a record missing any group is rejected with a descriptive error

### Requirement: Hard constraints exclude absolutely
The system SHALL hard-exclude any crop whose context violates a life–death threshold (temperature above `temp_death_max_c`, below `temp_death_min_c`, sunlight below `min_sunlight_hours`, or pot depth below `min_pot_depth_cm`) BEFORE scoring, and scoring SHALL NOT rescue an excluded crop.

#### Scenario: Heat kills a cool-season crop
- **WHEN** forecast max temperature exceeds a crop's death-max threshold
- **THEN** the crop is excluded and the exclusion reason is recorded

#### Scenario: Shallow pot excludes deep-root crop
- **WHEN** the user's pot depth is below the crop's minimum pot depth
- **THEN** the crop is excluded with the pot-depth reason recorded

#### Scenario: Unknown pot depth does not constrain
- **WHEN** pot depth is null (garden soil / unknown)
- **THEN** no pot-depth constraint is applied

### Requirement: Expected Success Score
The system SHALL score every surviving candidate 0–100 as Season_Fit×0.30 + Temp_Optimal_Fit×0.25 + Beginner_Ease×0.20 + Fast_Harvest_Bonus×0.15 + Sunlight/Space_Fit×0.10, reweighted by user goal (fastest_harvest, daily_food, easy_care) and beginner experience, with weights always summing to 1.0.

#### Scenario: Default weights
- **WHEN** the user provides no goal and no experience level
- **THEN** the default weight set is applied

#### Scenario: Fastest-harvest goal boosts speed
- **WHEN** the user goal is fastest_harvest
- **THEN** the fast-harvest weight increases and that component favors shorter days-to-harvest monotonically

#### Scenario: Daily-food goal penalizes single harvest
- **WHEN** the user goal is daily_food and a crop has the single_harvest tag
- **THEN** the crop's score is reduced

### Requirement: Season fit is scored, not hard-excluded
The system SHALL treat season fit as a scored component — crops outside their regional planting windows rank low rather than being hard-excluded — so mildly out-of-season crops can still appear when otherwise viable, and regions without regional rules fall back to a temperature-based season fit.

#### Scenario: Out-of-window crop ranks low
- **WHEN** a crop's month is outside every regional planting window
- **THEN** its season score is low but it is not hard-excluded

#### Scenario: Region without regional rules falls back
- **WHEN** the region has no regional rules (e.g., highland)
- **THEN** season fit is derived from temperature rather than planting windows

### Requirement: Regional anomaly and weather adjustments
The system SHALL apply regional anomaly flags (e.g., june_july_heatwave, rainy_season) as season-score penalties and SHALL boost flood-tolerant crops when the forecast calls for heavy rain.

#### Scenario: Rainy-season flag penalizes susceptible crops
- **WHEN** the rainy-season anomaly applies and the crop is flagged
- **THEN** its season score is reduced

#### Scenario: Heavy rain boosts flood-tolerant crops
- **WHEN** the forecast condition indicates heavy rain and the crop tolerates waterlogged soil
- **THEN** its season score is boosted

### Requirement: Controlled diversity (2 easy + 1 step-up)
The system SHALL return a Top 3 of the two highest-scoring non-fruit candidates plus the best surviving fruit_vegetable candidate as "step-up", selected independently of overall ranking; when no fruit crop survives, the third slot SHALL fall back to the next best candidate.

#### Scenario: Fruit crop in season takes the step-up slot
- **WHEN** at least one fruit_vegetable crop survives hard constraints
- **THEN** the best-scoring one occupies the third slot with role step_up regardless of its overall rank

#### Scenario: No surviving fruit crop
- **WHEN** no fruit_vegetable crop survives hard constraints
- **THEN** the third slot is the next best surviving candidate

### Requirement: NO_MATCH_STATE
The system SHALL return a no-match state instead of a forced list when hard constraints exclude every crop, with an advisory message suggesting to wait 1–2 weeks or try indoor growing / mushrooms / sprouts.

#### Scenario: All crops excluded
- **WHEN** no candidate survives hard constraints
- **THEN** the result is NO_MATCH_STATE carrying the advisory message

### Requirement: Weather abstraction
The system SHALL accept optional weather on the recommendation context; when absent, a dummy provider SHALL return seasonal average temperatures per region and month, and a real provider SHALL be swappable in Phase 2 without engine changes.

#### Scenario: Forecast overrides dummy values
- **WHEN** the context provides forecast temperatures
- **THEN** those values drive both hard constraints and scoring

#### Scenario: No weather provided
- **WHEN** the context omits weather
- **THEN** the dummy seasonal values are used

### Requirement: Community fail-rate feedback
The system SHALL apply community-reported fail rates as a score penalty, not a hard exclusion.

#### Scenario: High fail rate lowers rank
- **WHEN** community_fail_rate_override contains a crop id with a high rate
- **THEN** the crop's score is reduced but it remains a candidate

### Requirement: Audit mode
The system SHALL expose per-candidate component scores and per-crop exclusion reasons for developer debugging, and SHALL NOT display this data to end users.

#### Scenario: Developer inspects a recommendation run
- **WHEN** audit output is requested for a context
- **THEN** every candidate's Season/Temp/Beginner/FastHarvest/Sun-Space scores and every excluded crop's reasons are printed
