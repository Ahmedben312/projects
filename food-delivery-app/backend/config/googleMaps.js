const { Client } = require("@googlemaps/google-maps-services-js");

const googleMapsClient = new Client({});

const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  defaultZoom: 12,
  cities: {
    SFAX: { center: { lat: 34.7406, lng: 10.7603 } },
    NYC: { center: { lat: 40.7128, lng: -74.006 } },
  },
};

module.exports = { googleMapsClient, GOOGLE_MAPS_CONFIG };
