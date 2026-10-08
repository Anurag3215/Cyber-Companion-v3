# ADR-004: On-Device Application Permission Analysis

## Context
Auditing installed applications and permissions on Android could tempt developers to upload package names and metadata to cloud servers for centralized analysis. However, transmitting a user's installed application list constitutes high-risk PII leakage and violates zero-trust privacy.

## Decision
1. Execute all application enumeration and permission evaluation strictly **on-device** within client runtime memory.
2. Zero package names, app titles, or permission arrays are transmitted to the backend gateway or external third parties.
3. The client maps permissions to dangerous combination matrices (e.g. `SMS + INTERNET`) using a local rule engine.

## Consequences
- Guaranteed compliance with Google Play User Data policies.
- Instant analysis without requiring network connectivity.
- User privacy and installed app lists remain strictly private.
