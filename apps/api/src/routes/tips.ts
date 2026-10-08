import { Router, Request, Response } from 'express';
import tipsData from '../data/tips.json' assert { type: 'json' };

export const tipsRouter = Router();

// GET /v1/tips/daily
tipsRouter.get('/daily', (_req: Request, res: Response) => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24,
  );
  const tipIndex = dayOfYear % tipsData.length;
  res.status(200).json(tipsData[tipIndex]);
});

// GET /v1/tips/list
tipsRouter.get('/list', (req: Request, res: Response) => {
  const { category } = req.query;
  if (category && typeof category === 'string') {
    const filtered = tipsData.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    return res.status(200).json(filtered);
  }
  return res.status(200).json(tipsData);
});
