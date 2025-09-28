
// src/utils/auth.js

export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') return true;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const payload = JSON.parse(atob(payloadBase64));
    const currentTime = Math.floor(Date.now() / 1000);
    return typeof payload.exp === 'number' && payload.exp < currentTime;
  } catch (e) {
    return true;
  }
};