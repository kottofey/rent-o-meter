#!/usr/bin/env -S node --import=tsx

import { migrator } from './umzug.ts';

await migrator.runAsCLI();
