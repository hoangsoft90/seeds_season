# harvest-brag-card Specification

## Purpose
A "Harvest Brag Card" shows the estimated market value of a harvested crop — hidden by default, revealed on tap. Uses "giá trị sản lượng quy đổi" (not "tiết kiệm tiền") with a disclaimer about market price estimates.

## Requirements

### Requirement: Harvest Brag Card display
The system SHALL show a toggle-able value card on each harvested plant, displaying estimated yield (kg) and market value (VNĐ) calculated from crop category defaults.

#### Scenario: Card hidden by default
- **WHEN** a user views a harvested plant in the garden
- **THEN** the Brag Card value is hidden and a "👁️ Xem giá trị" button is shown

#### Scenario: Reveal value
- **WHEN** the user taps "👁️ Xem giá trị"
- **THEN** the card animates open showing yield estimate, market value, and a disclaimer

#### Scenario: Hide value
- **WHEN** the user taps "🙈 Ẩn đi"
- **THEN** the card animates closed

### Requirement: Value calculation
The system SHALL calculate estimated value using default yield per crop category × market price per kg, with a disclaimer: "theo giá rau sạch trung bình thị trường".

#### Scenario: Leafy green value
- **WHEN** a harvested crop has category "leafy_green"
- **THEN** the estimated yield is 0.3kg and value is 9,000 VNĐ (0.3 × 30,000)

### Requirement: Copy to clipboard
The system SHALL provide a "📋 Sao chép" button that copies a text summary to clipboard with crop name, days planted, yield, and value.

#### Scenario: Copy summary
- **WHEN** the user taps "📋 Sao chép"
- **THEN** a text summary is copied to clipboard and a "Đã sao chép!" toast appears for 2 seconds
