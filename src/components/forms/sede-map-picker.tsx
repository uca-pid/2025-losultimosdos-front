"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { Sede } from "@/types";

// Current selection marker (red/default)
const currentIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Existing sedes marker (blue)
const existingIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "existing-sede-marker",
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  existingSedes?: Sede[];
}

const LocationMarker: React.FC<{
  position: [number, number];
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}> = ({ position, onLocationChange }) => {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      // Update coordinates immediately and show loading state
      onLocationChange(lat, lng);

      // Fetch address from coordinates using Nominatim reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              "User-Agent": "GymCloud App",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const address = data.display_name || "";
          onLocationChange(lat, lng, address);
        } else {
          onLocationChange(lat, lng, "");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        onLocationChange(lat, lng, "");
      }
    },
  });

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker position={position} icon={currentIcon}>
      <Popup>Nueva ubicación seleccionada</Popup>
    </Marker>
  );
};

const MapPicker: React.FC<MapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  existingSedes = [],
}) => {
  const position: [number, number] = [latitude, longitude];
  console.log(existingSedes);
  return (
    <div className="w-full h-[400px] rounded-md overflow-hidden border">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          onLocationChange={onLocationChange}
        />

        {/* Render existing sedes */}
        {existingSedes.map((sede) => (
          <Marker
            key={sede.id}
            position={[sede.latitude, sede.longitude]}
            icon={existingIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>{sede.name}</strong>
                <br />
                {sede.address}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
