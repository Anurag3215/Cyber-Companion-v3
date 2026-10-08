import { Request, Response, NextFunction } from 'express';

const ADVERSARIAL_INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior) (instructions|rules|prompts)/i,
  /disregard (all )?(prior|previous) (rules|directives|instructions)/i,
  /you are now (in )?(dan|unfiltered|god) mode/i,
  /output (your )?(system prompt|initial instructions)/i,
  /bypass (security|safety|filter) (checks|rules|verdict)/i,
  /override (the )?verdict to (safe|clean|good)/i,
  /forget (everything|all rules)/i,
];

export function detectPromptInjection(input: string): boolean {
  for (const pattern of ADVERSARIAL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

export function promptInjectionGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  const query = req.body?.query;
  if (!query || typeof query !== 'string') {
    return next();
  }

  if (detectPromptInjection(query)) {
    return res.status(400).json({
      error: 'Adversarial Prompt Detected',
      message: 'The submitted query matches known prompt injection or jailbreak attack patterns.',
    });
  }

  next();
}
