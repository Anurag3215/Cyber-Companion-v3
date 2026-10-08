# Cyber Companion — Cross-Platform Capability & Limits Matrix

This specification details technical capabilities, sandbox constraints, and graceful fallbacks across **Android**, **iOS**, and **Web (Desktop/Mobile)** targets.

---

| Capability | Android | iOS | Web (Desktop / Mobile) | Graceful Fallback Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Wi-Fi SSID & BSSID Inspection** | Supported with fine location permission (`ACCESS_FINE_LOCATION`) | Restricted by Apple sandbox (NEHotspotNetwork requires special entitlement) | Unavailable via browser APIs (`navigator.connection` provides only network type) | Provide interactive manual Wi-Fi safety questionnaire and encryption verification guide. |
| **Wi-Fi Encryption Protocols** | WPA2, WPA3, Open, WEP detected via `WifiManager` | Not accessible without private APIs | Not accessible | Warn user about general public Wi-Fi risks; recommend VPN usage. |
| **QR Code Camera Scanner** | Full support via React Native Vision Camera / CameraX | Full support via Vision Camera / AVFoundation | Supported via HTML5 Video / BarcodeDetector API | Fallback to image upload analysis and manual paste input text box. |
| **Installed App Enumeration** | Supported via `PackageManager` (`QUERY_ALL_PACKAGES` strictly isolated or category intent queries) | Sandbox prohibits enumerating installed applications | Unavailable | Provide general OS permission audit tips and self-assessment checklist. |
| **App Permission Auditing** | On-device manifest parsing (`requestedPermissions`) | Not available | Not available | Educate users on iOS Privacy Nutrition Labels and permission management. |
| **Local Secure Storage** | MMKV / Android Keystore encrypted | MMKV / iOS Keychain | IndexedDB / `localStorage` (fallback) | Storage abstraction layer (`SecureStorageAdapter`) routes to appropriate engine. |
| **Threat Intel API Gateway** | Full Axios REST integration | Full Axios REST integration | Full Axios REST integration | Graceful offline state with local heuristic engine evaluation. |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | APNs / FCM | Web Push API (Service Worker) | In-app notification center fallback for web environments lacking push. |
