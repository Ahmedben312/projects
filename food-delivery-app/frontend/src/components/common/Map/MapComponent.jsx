import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./MapComponent.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const MapComponent = ({
  center = defaultCenter,
  markers = [],
  onMapClick,
  onMarkerClick,
  height = "400px",
  zoom = 12,
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef();

  const onLoad = (map) => {
    mapRef.current = map;
    setMap(map);
  };

  const onUnmount = () => {
    mapRef.current = null;
    setMap(null);
  };

  const handleMapClick = (event) => {
    if (onMapClick) {
      onMapClick({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  const containerStyle = {
    ...mapContainerStyle,
    height: height,
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  if (!apiKey) {
    return (
      <div className="map-component map-placeholder">
        <p>
          Google Maps API key is not set. Please add
          `REACT_APP_GOOGLE_MAPS_API_KEY` to your `.env`.
        </p>
      </div>
    );
  }

  const mapCenter = center || defaultCenter;

  return (
    <div className="map-component">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
              },
            ],
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
              icon={marker.icon}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="map-info-window">
                <h4>{selectedMarker.title}</h4>
                {selectedMarker.info && <p>{selectedMarker.info}</p>}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
