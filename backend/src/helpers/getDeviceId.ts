import crypto from 'crypto';

import type { Request } from 'express';

export default function getDeviceId(req: Request) {
  const userAgent = req.headers['user-agent'] ?? '';
  const ip = req.ip ?? req.headers['x-forwarded-for'] ?? 'unknown';
  return crypto.createHash('md5').update(`${userAgent}${ip.toString()}`).digest('hex');
}
