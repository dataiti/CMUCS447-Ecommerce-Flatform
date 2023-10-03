import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { getPlaceGoogleMapApi } from "../apis/map";
import { Marker } from "react-map-gl";

const MapContainer = ({ address }) => {
  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const defaultCenter = {
    lat: 40.712776,
    lng: -74.005974,
  };

  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    const getGeocodingData = async () => {
      try {
        const response = await getPlaceGoogleMapApi({ address });

        const { results } = response.data;

        if (results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          setMarkerPosition({ lat: lat, lng: lng });
        }
      } catch (error) {
        console.error("Error retrieving geocoding data:", error);
      }
    };
    getGeocodingData();
  }, [address]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAgTGUKefvQALME8djrEuCbvhVzCe5tRvA">
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
