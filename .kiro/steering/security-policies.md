---
inclusion: manual
---

# Security Policies — PrizeFlow

## Threat Model

PrizeFlow is a client-side-only application with no authentication, no backend, and no sensitive data transmission. The threat surface is minimal.

## Data Security

- All data lives in browser `localStorage` — it is not encrypted
- No personally identifiable information (PII) beyond names and optional contact info
- Data is only as secure as the user's browser/device
- Clearing browser data erases all application data

## Input Handling

- All user inputs are trimmed before storage
- No HTML is rendered from user input (React auto-escapes JSX)
- CSV export properly escapes values containing commas, quotes, and newlines
- No `dangerouslySetInnerHTML` usage permitted
- No `eval()` or dynamic code execution

## Dependencies

- Keep dependencies minimal (fewer attack surfaces)
- Run `npm audit` before each release
- Update dependencies quarterly or when critical vulnerabilities are reported
- Do not add dependencies that require network access at runtime

## Content Security

- No external scripts, fonts, or CDN resources loaded at runtime
- All assets are bundled and served from the same origin
- No cookies or session tokens
- No cross-origin requests

## What This Application Does NOT Handle

- Authentication or authorization
- Encryption (at rest or in transit beyond HTTPS)
- Personal data protection regulations (GDPR, CCPA)
- Audit trails or access logs
- Secret management

## Future Considerations

If the application evolves to include a backend:
- Implement proper authentication (OAuth 2.0 or similar)
- Encrypt data at rest in the database
- Add rate limiting to API endpoints
- Implement CSRF protection
- Add Content-Security-Policy headers
- Conduct a formal security review
