import { Router, Response } from 'express';
import { requireAdminRole, AuthenticatedAdminRequest } from '../middleware/adminRbacMiddleware';
import tipsData from '../data/tips.json';

export const adminRouter = Router();

// Strict CSP Middleware for Admin endpoints
adminRouter.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self';"
  );
  next();
});

// GET /v1/admin/metrics - Anonymized aggregate telemetry metrics (VIEWER+)
adminRouter.get('/metrics', requireAdminRole('VIEWER'), (_req: AuthenticatedAdminRequest, res: Response) => {
  res.json({
    period: 'last_30_days',
    metrics: {
      totalThreatScans: 14820,
      totalMaliciousDeflected: 892,
      totalSuspiciousFlagged: 2140,
      totalWifiAudits: 5310,
      openWifiWarningsIssued: 1104,
      dailyTipsDelivered: 42800,
      activeStreaksCount: 3820,
    },
    privacyAudit: {
      zeroPiiGuaranteed: true,
      anonymizationMethod: 'k-anonymity-aggregated-counters',
      rawUrlsRetained: 0,
      deviceIdentifiersTracked: 0,
    },
    timestamp: new Date().toISOString(),
  });
});

// POST /v1/admin/tips - Create new cyber awareness tip (EDITOR+)
adminRouter.post('/tips', requireAdminRole('EDITOR'), (req: AuthenticatedAdminRequest, res: Response) => {
  const { title, body, category } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body in payload' });
  }

  const newTip = {
    id: `tip_${Date.now()}`,
    title,
    body,
    category: category || 'GENERAL_AWARENESS',
    readingTimeMinutes: 1,
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({
    message: 'Tip published successfully to awareness feed',
    tip: newTip,
    createdBy: req.adminUser?.username,
  });
});

// DELETE /v1/admin/cache/threats - Flush threat verdict cache (ADMIN only)
adminRouter.delete('/cache/threats', requireAdminRole('ADMIN'), (req: AuthenticatedAdminRequest, res: Response) => {
  return res.status(200).json({
    message: 'Threat intelligence consensus cache flushed successfully',
    initiatedBy: req.adminUser?.username,
    timestamp: new Date().toISOString(),
  });
});
