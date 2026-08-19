# user-auth Specification

## Purpose
Login-on-demand auth: users can browse recommendations, crop details, and tips anonymously, but must sign in to add crops to their garden. Session is cookie-based; only garden-related actions and routes are protected.

## Requirements

### Requirement: Sign in and sign up
The system SHALL let users sign in and sign up, and SHALL manage their session via secure cookies.

#### Scenario: User signs up
- **WHEN** a new user signs up
- **THEN** they receive a session and are considered signed in

#### Scenario: User signs in later
- **WHEN** a returning user signs in
- **THEN** their previous garden data (if any) is associated with the same account

### Requirement: Anonymous browsing stays open
The system SHALL keep recommendation, crop detail, tips, and home pages publicly accessible without authentication.

#### Scenario: Anonymous browsing
- **WHEN** an anonymous user opens the home page, a crop detail page, or the tips tab
- **THEN** they can browse everything without signing in

### Requirement: Add-to-garden requires auth
The system SHALL require authentication for adding a crop to the garden and for all garden API routes; anonymous users are redirected to sign in.

#### Scenario: Anonymous add attempt
- **WHEN** an anonymous user taps "Thêm vào vườn"
- **THEN** they are redirected to sign in (with a return path back to where they were)

#### Scenario: Protected API rejected
- **WHEN** an unauthenticated request hits `/api/garden*`
- **THEN** the API returns 401 and does not create or return any garden data

### Requirement: Sign out
The system SHALL let a signed-in user sign out, ending their session.

#### Scenario: User signs out
- **WHEN** a signed-in user signs out
- **THEN** subsequent garden API calls return 401 until they sign in again
