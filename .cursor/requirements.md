# Requirements Document - KasapApp

## Introduction

KasapApp is a mobile application that connects users with butcher services for religious sacrificial offerings (Kurban, Adak, Şükür). The app provides a complete solution from order placement to delivery, including donation options, appointment scheduling, visual proof of service, and payment processing. The application aims to serve both local delivery and international donation needs, particularly for Africa-based charitable distributions.

## Requirements

### Requirement 1

**User Story:** As a user, I want to register and login to the app, so that I can place orders and track my service history.

#### Acceptance Criteria

1. WHEN a user opens the app for the first time THEN the system SHALL display welcome/onboarding screens
2. WHEN a user chooses to register THEN the system SHALL allow registration with email and password using Supabase Auth
3. WHEN a user enters valid credentials THEN the system SHALL authenticate and redirect to the home screen
4. IF a user enters invalid credentials THEN the system SHALL display appropriate error messages
5. WHEN a user is authenticated THEN the system SHALL maintain the session across app restarts

### Requirement 2

**User Story:** As a user, I want to select different types of sacrificial services, so that I can choose the appropriate religious offering.

#### Acceptance Criteria

1. WHEN a user accesses the order screen THEN the system SHALL display service types: Kurban, Adak, Şükür
2. WHEN a user selects a service type THEN the system SHALL show relevant options and pricing
3. WHEN a user makes a selection THEN the system SHALL store the choice and proceed to delivery options
4. IF no service type is selected THEN the system SHALL prevent proceeding to the next step

### Requirement 3

**User Story:** As a user, I want to choose how my order is handled after processing, so that I can decide between personal delivery, donation, or other services.

#### Acceptance Criteria

1. WHEN a user reaches delivery options THEN the system SHALL display: Personal delivery, Charity donation, Restaurant cooking & serving, Africa distribution
2. WHEN a user selects charity donation THEN the system SHALL show available charity organizations
3. WHEN a user selects restaurant service THEN the system SHALL show cooking and serving options
4. WHEN a user selects Africa distribution THEN the system SHALL show distribution details and locations
5. IF charity donation is selected THEN the system SHALL generate a donation receipt

### Requirement 4

**User Story:** As a user, I want to schedule an appointment for my service, so that I can choose a convenient time for processing.

#### Acceptance Criteria

1. WHEN a user accesses the calendar THEN the system SHALL display available dates and time slots
2. WHEN a user selects a date THEN the system SHALL show available time slots for that date
3. WHEN a time slot is fully booked THEN the system SHALL mark it as unavailable
4. WHEN a user confirms an appointment THEN the system SHALL reserve the slot and send confirmation
5. IF a user tries to book an unavailable slot THEN the system SHALL prevent the booking and suggest alternatives

### Requirement 5

**User Story:** As a user, I want to pay for my order using different payment methods, so that I can complete my purchase conveniently.

#### Acceptance Criteria

1. WHEN a user reaches payment THEN the system SHALL display available payment methods: PayPal, IBAN transfer, local payment options
2. WHEN a user selects PayPal THEN the system SHALL integrate with PayPal API for secure payment
3. WHEN a user selects IBAN transfer THEN the system SHALL display bank details and transfer instructions
4. WHEN payment is successful THEN the system SHALL confirm the order and update status
5. IF payment fails THEN the system SHALL display error message and allow retry

### Requirement 6

**User Story:** As a user, I want to receive visual proof of my service, so that I can verify the work was completed as requested.

#### Acceptance Criteria

1. WHEN service is completed THEN the system SHALL upload video and photo evidence
2. WHEN media is uploaded THEN the system SHALL notify the user via app notification and email
3. WHEN a user accesses media gallery THEN the system SHALL display all videos and photos for their orders
4. WHEN media files are large THEN the system SHALL optimize them for mobile viewing
5. IF media upload fails THEN the system SHALL retry and notify administrators

### Requirement 7

**User Story:** As a user, I want to track my order status, so that I can know the current progress of my service.

#### Acceptance Criteria

1. WHEN an order is placed THEN the system SHALL create a status timeline with stages: Ordered, Scheduled, In Progress, Completed, Delivered/Donated
2. WHEN order status changes THEN the system SHALL update the timeline and notify the user
3. WHEN a user views order details THEN the system SHALL display current status with visual indicators
4. WHEN service is completed THEN the system SHALL mark the order as complete with timestamp
5. IF there are delays THEN the system SHALL notify the user with updated timeline

### Requirement 8

**User Story:** As a user, I want to receive donation receipts when I choose charity options, so that I have proof of my charitable contribution.

#### Acceptance Criteria

1. WHEN a user selects charity donation THEN the system SHALL allow selection from available charity organizations
2. WHEN donation is processed THEN the system SHALL generate a PDF receipt with user and charity details
3. WHEN receipt is ready THEN the system SHALL send it via email and make it available in the app
4. WHEN a user accesses receipts THEN the system SHALL display all donation receipts with download options
5. IF receipt generation fails THEN the system SHALL retry and notify administrators

### Requirement 9

**User Story:** As an Africa-based user, I want to leave feedback about the service, so that I can share my experience with the community.

#### Acceptance Criteria

1. WHEN an Africa-based user completes a service THEN the system SHALL provide a review interface
2. WHEN submitting a review THEN the system SHALL allow anonymous or named submission
3. WHEN a review is submitted THEN the system SHALL require admin approval before publication
4. WHEN reviews are approved THEN the system SHALL display them in the reviews section
5. IF inappropriate content is detected THEN the system SHALL flag for admin review

### Requirement 10

**User Story:** As a user, I want to view my order history and media files, so that I can access past services and their documentation.

#### Acceptance Criteria

1. WHEN a user accesses profile THEN the system SHALL display order history with dates and details
2. WHEN a user selects a past order THEN the system SHALL show complete order details and associated media
3. WHEN viewing media THEN the system SHALL allow full-screen viewing and sharing options
4. WHEN orders are numerous THEN the system SHALL provide pagination or filtering options
5. IF media files are corrupted THEN the system SHALL display appropriate error messages

### Requirement 11

**User Story:** As a user, I want to add special notes to my orders, so that I can communicate specific requirements or dedications.

#### Acceptance Criteria

1. WHEN placing an order THEN the system SHALL provide a notes field for special instructions
2. WHEN entering notes THEN the system SHALL allow up to 500 characters of text
3. WHEN notes are saved THEN the system SHALL display them in order details and admin panel
4. WHEN service is processed THEN the system SHALL ensure notes are considered by service providers
5. IF notes contain inappropriate content THEN the system SHALL flag for review

### Requirement 12

**User Story:** As a user, I want to receive notifications about my order progress, so that I stay informed about important updates.

#### Acceptance Criteria

1. WHEN order status changes THEN the system SHALL send push notifications to the user's device
2. WHEN important updates occur THEN the system SHALL send email notifications as backup
3. WHEN notifications are sent THEN the system SHALL respect user notification preferences
4. WHEN media is available THEN the system SHALL notify the user immediately
5. IF notifications fail THEN the system SHALL retry and log the failure for admin review