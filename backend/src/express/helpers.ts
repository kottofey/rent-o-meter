import type { Request } from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = await fs.readFile(join(__dirname, '../../.env'), 'utf8');

// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam(req: Request) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
}

export { getIdParam };
