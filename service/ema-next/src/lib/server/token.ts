import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import type { z } from 'zod';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { Err } from '$lib/domain/errors';

const opts = {
  issuer: 'https://crows.moe',
  audience: 'https://ema.crows.moe',
  expireTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  jwtSecret: new TextEncoder().encode(env.EMA_JWT_SECRET),
};

export type Token<T extends JWTPayload> = {
  setToCookie: (from: Date, cookies: Cookies, payload: T) => Promise<void>;
  getFromCookie: (cookies: Cookies) => Promise<T | undefined>;
};

export function token<T extends JWTPayload>(name: string, schema: z.Schema): Token<T> {
  return {
    setToCookie: async (from: Date, cookies: Cookies, payload: T) => {
      const validate = schema.safeParse(payload);
      if (!validate.success) {
        throw Err.Invalid(`token '${name}' payload`, payload);
      }
      const expires = new Date(from.getTime() + opts.expireTime);
      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(opts.issuer)
        .setAudience(opts.audience)
        .setExpirationTime(expires)
        .sign(opts.jwtSecret);
      cookies.set(name, jwt, { path: '/', expires, secure: true, httpOnly: true, sameSite: 'strict' });
    },
    getFromCookie: async (cookies: Cookies): Promise<T | undefined> => {
      const tk = cookies.get(name);
      if (!tk) {
        return undefined;
      }
      try {
        const { payload } = await jwtVerify(tk, opts.jwtSecret, {
          issuer: opts.issuer,
          audience: opts.audience,
          requiredClaims: ['iss', 'aud', 'exp', 'iat'],
        });
        const validate = schema.safeParse(payload.voter);
        if (!validate.success) {
          return undefined;
        }
        return payload.voter as T;
      } catch (e) {
        return undefined;
      }
    },
  };
}
