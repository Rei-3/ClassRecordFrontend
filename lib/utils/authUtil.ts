import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import {jwtDecode}from 'jwt-decode';

const SECRET_KEY = 'base64:ARy9yMevgWXnEAF3oJJD15TRl2ljIoUPkd+QLlihNZk=';
const COOKIE_NAME = 'auth_token';
const REFRESH_TOKEN_NAME = 'refresh_token';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 7,
};

interface DecodedToken {
  exp: number;
  role?: string;
  username?: string;
  fname?: string;
  lname?: string;
}

export const getRole = (token: string): string | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || null;
  } catch (error) {
    
    return null;
  }
}

// Convert base64 key to WordArray
const getParsedKey = (): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Base64.parse(SECRET_KEY.replace('base64:', ''));
};

// 🔐 Encrypt data
export const encryptData = (data: string): string => {
  const key = getParsedKey();
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const result = iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  return result;
};

// 🔓 Decrypt data
export const decryptData = (ciphertext: string): string | null => {
  try {
    const [ivBase64, encryptedBase64] = ciphertext.split(':');
    if (!ivBase64 || !encryptedBase64) return null;

    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const encrypted = CryptoJS.enc.Base64.parse(encryptedBase64);
    const key = getParsedKey();

    const decrypted = CryptoJS.AES.decrypt(
  encrypted.toString(CryptoJS.enc.Base64), // Convert WordArray → Base64
  key,
  { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    
    return null;
  }
};

// 🍪 Set cookie
export const setAuthToken = (token: string): void => {
 
  const encryptedToken = encryptData(token);
 
  Cookies.set(COOKIE_NAME, encryptedToken, COOKIE_OPTIONS);
};


export const setRefreshToken = (token: string): void => {
  const encryptedToken = encryptData(token);
  Cookies.set(REFRESH_TOKEN_NAME, encryptedToken, COOKIE_OPTIONS);
}


// 🍪 Get cookie
export const getAuthToken = (): string | null => {
  const encryptedToken = Cookies.get(COOKIE_NAME);
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
};

export const getRefreshToken = (): string | null => {
  const encryptedToken = Cookies.get(REFRESH_TOKEN_NAME);
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
}

export const isTokenExpired = (token: string): boolean => {
  try {
   
    if (!token || token.split('.').length !== 3) {
   
      return true;
    }

    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000); 
    const bufferTime = 10;
    return decoded.exp < currentTime + bufferTime;
  } catch (err) {
  
    return true;
  }
}

const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_NAME);
}
// ❌ Remove cookie
const removeAuthToken = (): void => {
  Cookies.remove(COOKIE_NAME);
};

export const logout = (): void => {
  removeAuthToken();
  removeRefreshToken();
}
