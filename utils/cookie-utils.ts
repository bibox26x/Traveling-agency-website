import { setCookie, getCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export const setLanguageCookie = (
  locale: string,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  try {
    // Set cookie using cookies-next
    setCookie(LANGUAGE_COOKIE_NAME, locale, {
      req,
      res,
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Fallback: Set cookie directly if on client side
    if (typeof window !== 'undefined') {
      const cookieValue = `${LANGUAGE_COOKIE_NAME}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      document.cookie = cookieValue;
    }
  } catch (error) {
    console.error('Failed to set language cookie:', error);
    // Last resort: Try setting cookie directly
    if (typeof window !== 'undefined') {
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${locale}; path=/`;
    }
  }
};

export const getLanguageCookie = (
  req?: NextApiRequest,
  res?: NextApiResponse
): string | undefined => {
  try {
    const cookie = getCookie(LANGUAGE_COOKIE_NAME, { req, res });
    return typeof cookie === 'string' ? cookie : undefined;
  } catch (error) {
    console.error('Failed to get language cookie:', error);
    // Fallback: Try getting cookie directly
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const langCookie = cookies.find(c => c.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`));
      if (langCookie) {
        return langCookie.split('=')[1].trim();
      }
    }
    return undefined;
  }
}; 