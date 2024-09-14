"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";

// Define the type for boundingBox
interface BoundingBox {
  sw: { latitude: number; longitude: number };
  ne: { latitude: number; longitude: number };
}

const containerStyle = {
  width: "100%",
  height: "100%",
};



const ClientMap = ({ boundingBox, center }:{boundingBox:BoundingBox, center:{latitude:number, longitude:number}}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const polygonRef = useRef<Polygon | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "", // Add your API key here
  });

  useEffect(() => {
    if (map && boundingBox) {
      // Extract SW and NE corners from boundingBox
      const { sw, ne } = boundingBox;

      // Convert { latitude, longitude } to { lat, lng }
      const swLatLng = { lat: sw.latitude, lng: sw.longitude };
      const neLatLng = { lat: ne.latitude, lng: ne.longitude };

      // Create bounds using SW and NE corners
      const bounds = new google.maps.LatLngBounds(swLatLng, neLatLng);
      map.fitBounds(bounds);
    }
  }, [map, boundingBox]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  // Convert boundingBox to an array of LatLng objects for Polygon paths
  const polygonPaths = boundingBox
    ? [
        { lat: boundingBox.sw.latitude, lng: boundingBox.sw.longitude },
        { lat: boundingBox.ne.latitude, lng: boundingBox.sw.longitude },
        { lat: boundingBox.ne.latitude, lng: boundingBox.ne.longitude },
        { lat: boundingBox.sw.latitude, lng: boundingBox.ne.longitude },
      ]
    : [];

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: center.latitude, lng: center.longitude }}
      zoom={18}
      onLoad={onLoad}
      tilt={2}
      mapTypeId="satellite"
    >
      {boundingBox && (
        <Polygon
          ref={polygonRef}
          paths={polygonPaths}
          options={{
            fillColor: "#0000FF",
            fillOpacity: 0.03,
            strokeColor: "#0000FF",
            strokeOpacity: 1,
            strokeWeight: 2,
            clickable: false,
            draggable: false,
            editable: false,
            geodesic: false,
            zIndex: 1,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default ClientMap;
