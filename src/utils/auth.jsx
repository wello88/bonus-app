import { jwtDecode } from 'jwt-decode';

export const verifyToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime ? decoded : null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
