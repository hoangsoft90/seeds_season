# ai-explanation Specification

## Purpose
Replace template-based "Why" explanations with AI-generated natural language explanations. The AI only explains recommendations — it does NOT change the recommendation engine (principle 0.4: AI is explanation layer, not recommendation layer).

## Requirements

### Requirement: AI explanation provider
The system SHALL implement an `ExplainProvider` interface that generates natural language explanations for each recommended crop, using the recommendation context and crop data as input.

#### Scenario: Generate explanation for top crop
- **WHEN** the recommendation engine returns top 3 crops with scores
- **THEN** the provider generates a natural language explanation for each crop explaining why it was recommended

#### Scenario: Explanation includes key factors
- **WHEN** an explanation is generated for a crop
- **THEN** it mentions at least: season fit, temperature suitability, and beginner ease

### Requirement: Graceful fallback to templates
The system SHALL fall back to existing template explanations when the AI API fails, times out (5s), or when no API key is configured.

#### Scenario: No API key configured
- **WHEN** the OPENAI_API_KEY environment variable is not set
- **THEN** the system uses template explanations (existing behavior)

#### Scenario: API failure
- **WHEN** the AI API returns an error or times out
- **THEN** the system falls back to template explanations silently

### Requirement: Explanation caching
The system SHALL cache AI explanations for 5 minutes per unique context+crop combination to reduce API costs.

#### Scenario: Same context request
- **WHEN** two requests have the same region, month, and crop
- **THEN** only one API call is made; the second uses cached explanation
