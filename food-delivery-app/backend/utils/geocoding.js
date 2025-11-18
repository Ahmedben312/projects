const googleMapsService = require("../services/googleMapsService");

const geocodeAddress = async (address) => {
  try {
    const result = await googleMapsService.geocodeAddress(address);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const calculateDeliveryDistance = async (
  restaurantLocation,
  deliveryLocation
) => {
  try {
    const origin = `${restaurantLocation.lat},${restaurantLocation.lng}`;
    const destination = `${deliveryLocation.lat},${deliveryLocation.lng}`;

    const result = await googleMapsService.calculateDistance(
      origin,
      destination
    );
    return {
      success: true,
      distance: result.distance,
      duration: result.duration,
    };
  } catch (error) {
    console.error("Distance calculation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const estimateDeliveryTime = (preparationTime, travelTime) => {
  const bufferTime = 10; // 10 minutes buffer
  return preparationTime + travelTime + bufferTime;
};

const generateRandomLocationInCity = (cityCenter, radiusKm = 5) => {
  const radiusInDegrees = radiusKm / 111; // Approximately 111km per degree

  const randomOffset = () => (Math.random() - 0.5) * 2 * radiusInDegrees;

  return {
    lat: cityCenter.lat + randomOffset(),
    lng: cityCenter.lng + randomOffset(),
  };
};

module.exports = {
  geocodeAddress,
  calculateDeliveryDistance,
  estimateDeliveryTime,
  generateRandomLocationInCity,
};
