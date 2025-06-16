import { setCookie, getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export const setLanguageCookie = (
  locale: string,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  // Set both i18next and Next.js cookies
  setCookie(LANGUAGE_COOKIE_NAME, locale, {
    req,
    res,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    domain: typeof window !== 'undefined' ? window.location.hostname : undefined,
  });
};

export const getLanguageCookie = (
  req?: NextApiRequest,
  res?: NextApiResponse
): string | undefined => {
  const cookie = getCookie(LANGUAGE_COOKIE_NAME, { req, res });
  return typeof cookie === 'string' ? cookie : undefined;
}; 