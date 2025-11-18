const {
  googleMapsClient,
  GOOGLE_MAPS_CONFIG,
} = require("../config/googleMaps");

class GoogleMapsService {
  constructor() {
    this.apiKey = GOOGLE_MAPS_CONFIG.apiKey;
  }

  async geocodeAddress(address) {
    try {
      const response = await googleMapsClient.geocode({
        params: {
          address: address,
          key: this.apiKey,
        },
      });

      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          formattedAddress: result.formatted_address,
          location: result.geometry.location,
          placeId: result.place_id,
        };
      }

      throw new Error("No results found for the provided address");
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error("Failed to geocode address");
    }
  }

  async calculateDistance(origin, destination) {
    try {
      const response = await googleMapsClient.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          key: this.apiKey,
        },
      });

      const element = response.data.rows[0].elements[0];

      if (element.status === "OK") {
        return {
          distance: element.distance,
          duration: element.duration,
        };
      }

      throw new Error("Could not calculate distance");
    } catch (error) {
      console.error("Distance calculation error:", error);
      throw new Error("Failed to calculate distance");
    }
  }

  async getDirections(origin, destination) {
    try {
      const response = await googleMapsClient.directions({
        params: {
          origin: origin,
          destination: destination,
          key: this.apiKey,
        },
      });

      if (response.data.routes.length > 0) {
        const route = response.data.routes[0];
        return {
          polyline: route.overview_polyline,
          distance: route.legs[0].distance,
          duration: route.legs[0].duration,
          steps: route.legs[0].steps,
        };
      }

      throw new Error("No route found");
    } catch (error) {
      console.error("Directions error:", error);
      throw new Error("Failed to get directions");
    }
  }

  async autocomplete(input, location = null) {
    try {
      const params = {
        input: input,
        key: this.apiKey,
        types: "address",
      };

      if (location) {
        params.location = `${location.lat},${location.lng}`;
        params.radius = 50000; // 50km radius
      }

      const response = await googleMapsClient.placeAutocomplete({
        params: params,
      });

      return response.data.predictions.map((prediction) => ({
        description: prediction.description,
        placeId: prediction.place_id,
      }));
    } catch (error) {
      console.error("Autocomplete error:", error);
      throw new Error("Failed to get autocomplete suggestions");
    }
  }
}

module.exports = new GoogleMapsService();
