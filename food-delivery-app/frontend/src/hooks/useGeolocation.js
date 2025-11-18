import { useState, useEffect } from "react";

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({
        latitude,
        longitude,
        timestamp: position.timestamp,
      });
      setLoading(false);
    };

    const handleError = (error) => {
      let errorMessage = "Unknown error occurred while getting location.";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      setLoading(false);
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
  }, []);

  return { location, error, loading };
};
