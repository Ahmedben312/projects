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

      // error.code is a numeric value: 1=PERMISSION_DENIED,2=POSITION_UNAVAILABLE,3=TIMEOUT
      switch (error.code) {
        case 1:
          errorMessage = "User denied the request for Geolocation.";
          break;
        case 2:
          errorMessage = "Location information is unavailable.";
          break;
        case 3:
          errorMessage = "The request to get user location timed out.";
          break;
        default:
          errorMessage = error.message || errorMessage;
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
  }, [JSON.stringify(options)]);

  return { location, error, loading };
};
