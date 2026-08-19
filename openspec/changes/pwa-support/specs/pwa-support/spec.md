## Purpose

PWA support so the app runs well on mobile browsers: an installable web app manifest and a service worker that caches the app shell for fast startup and basic offline use after the first visit.

## ADDED Requirements

### Requirement: Web app manifest
The system SHALL serve a web app manifest declaring app name, short name, theme color, background color and icons.

#### Scenario: Manifest is served
- **WHEN** a browser requests the manifest
- **THEN** it receives valid manifest JSON with the app identity and icons

#### Scenario: Installable on mobile
- **WHEN** a mobile browser loads the site
- **THEN** the manifest enables add-to-home-screen / install prompts

### Requirement: Service worker with offline app shell
The system SHALL register a service worker that caches the app shell (HTML and static assets) so the app loads without network after the first visit, and SHALL NOT cache personalized recommendation responses.

#### Scenario: First visit caches the shell
- **WHEN** a user visits the app online
- **THEN** the app shell is cached by the service worker

#### Scenario: Offline load
- **WHEN** the user reopens the app with no network
- **THEN** the cached app shell is served

#### Scenario: Recommendations stay network-first
- **WHEN** the app calls /api/recommendations
- **THEN** the request is never served from cache
