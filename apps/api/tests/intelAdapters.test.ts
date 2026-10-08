import { ThreatIntelAdapters } from '../src/services/intelAdapters';

describe('Threat Intelligence Adapters', () => {
  test('VirusTotal adapter flags known malware fixture', async () => {
    const res = await ThreatIntelAdapters.checkVirusTotal('https://bad-site-trojan.com');
    expect(res.source).toBe('VIRUSTOTAL');
    expect(res.isMalicious).toBe(true);
    expect(res.positives).toBeGreaterThan(0);
  });

  test('Safe Browsing adapter flags deceptive phishing fixture', async () => {
    const res = await ThreatIntelAdapters.checkGoogleSafeBrowsing('https://phishing-update.com');
    expect(res.source).toBe('GOOGLE_SAFE_BROWSING');
    expect(res.isMalicious).toBe(true);
  });

  test('URLhaus adapter checks malware payloads cleanly', async () => {
    const res = await ThreatIntelAdapters.checkUrlhaus('https://legit-site.com');
    expect(res.isMalicious).toBe(false);
  });
});
