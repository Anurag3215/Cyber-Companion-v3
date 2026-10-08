import { classifyQrPayload } from '../src/services/qrScannerService';

describe('QR Scanner Payload Classifier', () => {
  test('correctly identifies HTTPS URLs', () => {
    const res = classifyQrPayload('https://bank-security-portal.xyz/login');
    expect(res.type).toBe('URL');
    expect(res.sanitizedDestination).toBe('https://bank-security-portal.xyz/login');
  });

  test('correctly parses Wi-Fi connection payloads', () => {
    const res = classifyQrPayload('WIFI:S:Guest_Cafe;T:WPA;P:secret123;;');
    expect(res.type).toBe('WIFI');
    expect(res.metadata?.ssid).toBe('Guest_Cafe');
    expect(res.metadata?.authType).toBe('WPA');
  });

  test('correctly detects UPI / App Deep Links', () => {
    const res = classifyQrPayload('upi://pay?pa=merchant@bank&pn=MerchantStore&am=500');
    expect(res.type).toBe('DEEP_LINK');
  });

  test('falls back to Plain Text for arbitrary text', () => {
    const res = classifyQrPayload('Coupon code: CYBER2026');
    expect(res.type).toBe('PLAIN_TEXT');
  });
});
