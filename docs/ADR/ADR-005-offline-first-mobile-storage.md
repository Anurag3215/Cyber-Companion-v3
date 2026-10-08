# ADR-005: Offline-First Local Storage Architecture

## Context
Cyber Companion must remain responsive and informative when devices lose internet access (e.g. airplane mode, underground transit). Awareness tips, recent scan history, and security scores must be accessible offline.

## Decision
1. Implement a unified `StorageAdapter` interface supporting:
   - Native Mobile: MMKV / Encrypted Keystore for sub-millisecond, hardware-encrypted read/write operations.
   - Web Platform: `localStorage` / IndexedDB with automatic graceful fallback.
2. Ship an initial seed of 30+ versioned cybersecurity tips embedded within client assets, updating periodically via backend sync when connected.

## Consequences
- Fast cold-start performance.
- Seamless offline awareness training.
- Encrypted storage protects scan history from other apps on rooted devices.
