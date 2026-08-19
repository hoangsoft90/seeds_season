## Purpose

My Garden lets a logged-in user track the crops they are actually growing, and — critically — records failures as **Ghost Plants** (with `died_at` and a quick `cause`) instead of deleting them. This is the core Data Moat: personal failure history enables "last time this failed, try this instead" personalization competitors can't copy.

## ADDED Requirements

### Requirement: Add crop to garden
The system SHALL let a logged-in user add a crop to their garden, recording the crop id and the planting date. The action requires authentication; anonymous users are prompted to sign in (see `add-to-garden-auth`).

#### Scenario: Add from recommendation card
- **WHEN** a logged-in user taps "Thêm vào vườn" on a crop card
- **THEN** the crop is added to their garden with today as the planting date and a success confirmation is shown

#### Scenario: Anonymous user blocked
- **WHEN** an anonymous user taps "Thêm vào vườn"
- **THEN** they are prompted to sign in instead of adding the crop

### Requirement: Garden list
The system SHALL show the logged-in user's garden: each tracked crop with its name, planting date, and current status (growing / ghost).

#### Scenario: List own garden
- **WHEN** a logged-in user opens the garden page
- **THEN** they see only their own crops with name, planting date, and status

#### Scenario: Empty garden
- **WHEN** a logged-in user with no tracked crops opens the garden page
- **THEN** an empty state invites them to add crops from recommendations

### Requirement: Ghost plant on failure
When a user marks a tracked crop as dead or removes it, the system SHALL NOT delete the record. It SHALL convert the crop to a ghost plant storing `died_at` and one of four quick causes: ☀️ nắng gắt/héo, 🐛 sâu bệnh, 🌊 úng nước, ❓ không rõ.

#### Scenario: Mark crop as dead
- **WHEN** a user marks a growing crop as dead and picks a cause (e.g. nắng gắt)
- **THEN** the crop becomes a ghost plant with `died_at` set to now and the chosen cause, and it disappears from the "growing" list

#### Scenario: Removal keeps history
- **WHEN** a user removes a crop from their garden without marking it dead
- **THEN** the record is kept as a ghost plant with cause ❓ không rõ (history is never destroyed)

### Requirement: Failure-aware suggestion (data moat)
The system SHALL use the user's ghost plant history (crop + month + cause) to nudge a better alternative: when the same crop was failed recently in a similar context, the recommendation explanation MAY mention the past failure and suggest a more suitable crop.

#### Scenario: Suggest alternative after failure
- **WHEN** a user who failed growing cải xanh in July (cause: nắng gắt) gets recommendations in a hot month
- **THEN** the explanation notes the past failure and suggests a heat-tolerant alternative like mồng tơi

#### Scenario: No history, no nudge
- **WHEN** the user has no ghost plants
- **THEN** recommendations are unaffected (no failure history to use)
