import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { icons } from "../utils/icons";
import { getPlaceMapApi } from "../apis/map";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxMap = ({ address, setIsLoading }) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "400px",
    latitude: 0,
    longitude: 0,
    zoom: 13,
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const data = await getPlaceMapApi({ address });
        if (data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          setViewport((prevViewport) => ({
            ...prevViewport,
            latitude,
            longitude,
          }));
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [address]);

  console.log("viewport", viewport);

  return (
    <ReactMapGL
      {...viewport}
      attributionControl={false}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(newViewport) => setViewport(newViewport)}
    >
      <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
        <icons.IoLocationSharp size={28} color="red" />
      </Marker>
    </ReactMapGL>
  );
};

export default MapboxMap;
