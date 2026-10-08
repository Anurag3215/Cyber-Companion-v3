import { analyzeUrlHeuristics } from '../src/services/heuristicsService';

describe('URL Heuristics Engine', () => {
  test('flags Punycode homoglyphs as malicious', () => {
    const res = analyzeUrlHeuristics('https://xn--pple-43d.com/login');
    expect(res.isMalicious).toBe(true);
    expect(res.flags).toContain('PUNYCODE_HOMOGLYPH');
  });

  test('flags IP literal hosts', () => {
    const res = analyzeUrlHeuristics('http://198.51.100.22/verify');
    expect(res.isSuspicious || res.isMalicious).toBe(true);
    expect(res.flags).toContain('IP_HOST_LITERAL');
    expect(res.flags).toContain('INSECURE_HTTP');
  });

  test('flags userinfo authority spoofing', () => {
    const res = analyzeUrlHeuristics('https://google.com@attacker-site.com/auth');
    expect(res.flags).toContain('USERINFO_SPOOFING');
    expect(res.score).toBeGreaterThanOrEqual(40);
  });

  test('flags known URL shorteners', () => {
    const res = analyzeUrlHeuristics('https://bit.ly/3xY8a');
    expect(res.flags).toContain('URL_SHORTENER');
  });

  test('evaluates legitimate HTTPS domain as safe', () => {
    const res = analyzeUrlHeuristics('https://github.com/Anurag3215/Cyber-Companion-v3');
    expect(res.isMalicious).toBe(false);
    expect(res.isSuspicious).toBe(false);
    expect(res.score).toBe(0);
    expect(res.flags.length).toBe(0);
  });
});
