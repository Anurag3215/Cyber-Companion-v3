import { Router, Request, Response } from 'express';
import tipsData from '../data/tips.json';

export const tipsRouter = Router();

// GET /v1/tips/daily and /v1/tips/today
tipsRouter.get(['/daily', '/today'], (_req: Request, res: Response) => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24,
  );
  const tipIndex = dayOfYear % tipsData.length;
  const tip = tipsData[tipIndex];
  res.status(200).json({
    ...tip,
    readingTimeMinutes: 1,
  });
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
