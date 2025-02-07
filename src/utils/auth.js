import {jwtDecode} from "jwt-decode";

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");

  if (!token) return true; // No token means expired

  try {
    const decodedToken = jwtDecode(token);
    return Date.now() >= decodedToken.exp * 1000; // Check if expired
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};
