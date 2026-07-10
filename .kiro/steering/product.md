---
inclusion: auto
---

# Product Context — PrizeFlow

## What Is PrizeFlow?

PrizeFlow is a lightweight web application that digitizes prize distribution for schools, universities, and organizations. It replaces manual paper-based and spreadsheet-based workflows with a centralized dashboard.

## Canonical Product Requirements

The full Product Requirements Document lives at:

#[[file:docs/PRD.md]]

All implementation decisions must trace back to this document. If a request contradicts the PRD, clarify with the user before proceeding.

## MVP Scope

The shipped MVP includes:

- Dashboard with real-time summary counts (Total, Claimed, Unclaimed)
- Recipient CRUD with instant search
- Prize CRUD with single-recipient assignment
- Prize claim/unclaim toggling with ISO 8601 date recording
- Claimed and unclaimed report views with CSV export
- Responsive layout (768px+)
- localStorage persistence (no backend)
- Vercel zero-config deployment

## Non-Goals (Do Not Implement)

- Authentication, authorization, or user accounts
- Notifications (email, SMS, push)
- QR/barcode scanning
- Payment processing
- Analytics or telemetry
- Cloud database integrations
- Offline/PWA support
- Mobile-native apps
- AI/ML features
- Internationalization

## Target Users

| Role | Context |
|------|---------|
| Event Organizer | Plans and runs prize distribution events |
| Claims Desk Volunteer | Operates the claims desk; searches and marks claims |

## Key Constraints

- Events have fewer than 500 prizes and recipients
- Single-device operation per browser session
- Data lives in browser localStorage (volatile)
- Internet required only for initial page load
