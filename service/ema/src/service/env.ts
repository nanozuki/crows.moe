import { Stage } from '@service/value';

export const nodeEnv = process.env.NODE_ENV || 'development';
export const isDev = nodeEnv === 'development';
export const isProd = nodeEnv === 'production';
export const devStage = process.env['EMA_DEV_STAGE'] as Stage;
export const jwtSecret = new TextEncoder().encode(process.env['EMA_JWT_SECRET'] || 'https://ema.crows.moe'); // default for dev
