import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "./auth";

export const useTokenValidation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      if (isTokenExpired()) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkToken(); // Run immediately on mount

    const interval = setInterval(checkToken, 30 * 1000); // Check every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);
};

export default useTokenValidation;
