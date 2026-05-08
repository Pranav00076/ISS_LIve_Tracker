import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Position } from "../utils/geo";
import { cn } from "../utils/cn";

// Simple SVG icon for ISS
const issIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-satellite"><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="m9 21 3-3"/></svg>`;

const issIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="bg-blue-600 text-white p-1 rounded-full shadow-lg border-2 border-white w-8 h-8 flex items-center justify-center">${issIconSvg}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface MapProps {
  currentPosition: Position | null;
  history: Position[];
  speed: number;
  className?: string;
}

// Component to handle auto-centering when position changes
function MapController({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
        duration: 2,
      });
    }
  }, [position, map]);

  return null;
}

export function ISSMap({
  currentPosition,
  history,
  speed,
  className,
}: MapProps) {
  // Need a default center to render initially
  const defaultCenter: [number, number] = [0, 0];

  const polylinePositions: [number, number][] = history
    .slice(-15)
    .map((p) => [p.lat, p.lng]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl shadow-inner border border-slate-200 dark:border-slate-800 h-[400px] lg:h-[500px]",
        className,
      )}
    >
      {currentPosition ? (
        <MapContainer
          center={[currentPosition.lat, currentPosition.lng]}
          zoom={4}
          scrollWheelZoom={true}
          className="h-full w-full z-0 font-sans"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            className="map-tiles"
          />
          {/* Alternative dark mode capable map - but handling dark mode perfectly in leaflet is tricky without custom tile server. We use cartodb for a clean look */}

          <MapController position={currentPosition} />

          {history.length > 1 && (
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: "#ef4444",
                weight: 3,
                opacity: 0.7,
                dashArray: "5, 10",
              }}
            />
          )}

          <Marker
            position={[currentPosition.lat, currentPosition.lng]}
            icon={issIcon}
          >
            <Popup className="font-sans">
              <div className="text-sm">
                <p className="font-semibold mb-1">ISS Current Location</p>
                <p>Lat: {currentPosition.lat.toFixed(4)}</p>
                <p>Lng: {currentPosition.lng.toFixed(4)}</p>
                <p>
                  Time:{" "}
                  {new Date(
                    currentPosition.timestamp * 1000,
                  ).toLocaleTimeString()}
                </p>
                <p className="text-blue-600 mt-1 font-medium">
                  {speed.toFixed(2)} km/h
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="w-full h-full bg-slate-100 dark:bg-[#151828] flex flex-col justify-center animate-pulse">
          <div className="w-full h-full bg-slate-200/50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center">
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-blue-500/20 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                 <div className="w-8 h-8 bg-blue-500/40 dark:bg-blue-500/20 rounded-full animate-ping"></div>
               </div>
               <div className="bg-slate-300 dark:bg-slate-700 h-4 w-32 rounded mb-2"></div>
               <div className="bg-slate-200 dark:bg-slate-800 h-3 w-48 rounded"></div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
