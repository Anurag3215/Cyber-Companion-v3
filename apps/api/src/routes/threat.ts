import { Router, Request, Response } from 'express';
import { ssrfGuardMiddleware } from '../middleware/ssrfGuard.js';
import { VerdictService } from '../services/verdictService.js';
import { evaluateWifiRisk, WifiEncryption } from '../services/wifiRiskService.js';

export const threatRouter = Router();

// URL Inspection Endpoint protected by SSRF Guard
threatRouter.post('/inspect', ssrfGuardMiddleware, async (req: Request, res: Response) => {
  const { url, forceRefresh } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const verdict = await VerdictService.evaluateUrl(url, Boolean(forceRefresh));
    return res.status(200).json(verdict);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Evaluation Failed',
      message: err.message || 'Internal analysis error',
    });
  }
});

// Wi-Fi Risk Assessment Endpoint
threatRouter.post('/wifi/assess', (req: Request, res: Response) => {
  const { ssid, securityType, isCaptivePortal } = req.body;
  const encryption: WifiEncryption = securityType || 'OPEN';

  const assessment = evaluateWifiRisk(
    encryption,
    ssid || 'Unknown Network',
    Boolean(isCaptivePortal),
  );

  return res.status(200).json(assessment);
});
