# weather-api Specification

## Purpose
Replace the dummy weather provider with real weather data from Open-Meteo (free, no API key). The recommendation engine uses weather for temperature-based hard constraints and scoring — real forecast data means more accurate suggestions.

## Requirements

### Requirement: Real weather provider
The system SHALL implement `OpenMeteoWeatherProvider` that fetches temperature data from Open-Meteo API using city coordinates, returning `WeatherInfo` (temp_max, temp_min, condition).

#### Scenario: Fetch weather for Hanoi
- **WHEN** the recommendation engine requests weather for `north_vietnam` in August
- **THEN** the provider fetches from Open-Meteo with Hanoi coordinates and returns actual forecast temperatures

#### Scenario: API returns data
- **WHEN** Open-Meteo returns a successful response
- **THEN** the provider extracts daily temperature min/max and maps condition (rain/clear/cloudy)

### Requirement: Graceful fallback
The system SHALL fall back to `DummyWeatherProvider` (monthly averages) when the Open-Meteo API fails, times out (5s), or returns invalid data.

#### Scenario: API timeout
- **WHEN** Open-Meteo doesn't respond within 5 seconds
- **THEN** the provider returns dummy weather data and logs a warning

#### Scenario: API error
- **WHEN** Open-Meteo returns HTTP 4xx or 5xx
- **THEN** the provider falls back to dummy data silently

### Requirement: Response caching
The system SHALL cache weather responses for 1 hour per region to avoid redundant API calls.

#### Scenario: Cached response
- **WHEN** two requests come in within 1 hour for the same region and month
- **THEN** only one API call is made; the second uses cached data

### Requirement: API route integration
The `/api/recommendations` route SHALL use the real weather provider when city coordinates are available, falling back to dummy when not.

#### Scenario: Request with city
- **WHEN** a recommendation request includes a recognized city
- **THEN** real weather data is used for scoring

#### Scenario: Request without city
- **WHEN** a recommendation request only has region (no specific city)
- **THEN** dummy weather data is used (same as before)
