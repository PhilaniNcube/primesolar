"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";
import { RoofSegment } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Sun, Ruler, MapPin, Square } from "lucide-react";



const containerStyle = {
  width: "100%",
  height: "100%",
};



const ClientMap = ({
  roofSegmentStats,
}: {
  roofSegmentStats: RoofSegment[];
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const polygonRef = useRef<Polygon | null>(null);

  // use state to get the  frist roof segment
  const [selectedRoofSegment, setSelectedRoofSegment] = useState(
    roofSegmentStats[0]!,
  );

  // get the center of the selected roof segment
  const center = selectedRoofSegment.center;
  const boundingBox = selectedRoofSegment.boundingBox;

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
  }, [map, boundingBox, selectedRoofSegment]);

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
    <div>
      <div className="mb-3">
        <Select>
          <SelectTrigger className="w-[560px]">
            <SelectValue placeholder="Select a roof segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roofSegmentStats.map((segment, index) => (
                <SelectItem
                  value={index.toString()}
                  key={segment.center.latitude}
                  onClick={() => setSelectedRoofSegment(segment)}
                >
                  <SelectLabel>
                    {`Roof Segment ${index + 1} ${segment.pitchDegrees}°`}
                  </SelectLabel>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Card className="w-full max-w-2xl mt-3">
          <CardHeader>
            <CardTitle>Roof Segment Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <span>
                  Pitch: {selectedRoofSegment.pitchDegrees.toFixed(2)}°
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Compass className="h-5 w-5 text-muted-foreground" />
                <span>
                  Azimuth: {selectedRoofSegment.azimuthDegrees.toFixed(2)}°
                </span>
              </div>



              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>
                  Center: {center.latitude.toFixed(6)},{" "}
                  {center.longitude.toFixed(6)}
                </span>
              </div>
              <div className="col-span-full">
                <h4 className="mb-2 font-semibold">Bounding Box</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    SW: {boundingBox.sw.latitude.toFixed(6)},{" "}
                    {boundingBox.sw.longitude.toFixed(6)}
                  </div>
                  <div>
                    NE: {boundingBox.ne.latitude.toFixed(6)},{" "}
                    {boundingBox.ne.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <span>
                  Plane Height at Center: {selectedRoofSegment.planeHeightAtCenterMeters.toFixed(2)}{" "}
                  m
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
    </div>
  );
};

export default ClientMap;
