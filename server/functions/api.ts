// server/functions/api.ts

import serverless from 'serverless-http';
import { app } from '../src/index'; 

export const handler = serverless(app);