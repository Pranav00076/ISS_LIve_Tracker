import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { calculateSpeed, Position } from "../utils/geo";

export interface TrackerState {
  currentPosition: Position | null;
  history: Position[];
  speed: number;
  nearestPlace: string;
  peopleInSpace: number;
  astronauts: { name: string; craft: string }[];
  isLoading: boolean;
  error: string | null;
  isAutoRefresh: boolean;
  lastUpdated: Date | null;
}

const MAX_HISTORY = 30;
const POLL_INTERVAL = 15000;

export function useISSTracking() {
  const [state, setState] = useState<TrackerState>({
    currentPosition: null,
    history: [],
    speed: 0,
    nearestPlace: "Loading...",
    peopleInSpace: 0,
    astronauts: [],
    isLoading: true,
    error: null,
    isAutoRefresh: true,
    lastUpdated: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      // Fetch ISS location
      const issData = await api.getISSLocation();
      const newPos: Position = {
        lat: parseFloat(issData.iss_position.latitude),
        lng: parseFloat(issData.iss_position.longitude),
        timestamp: issData.timestamp,
      };

      // Fetch Place Name
      const placeName = await api.getNearestPlace(newPos.lat, newPos.lng);

      setState((prev) => {
        let newSpeed = prev.speed;

        // Calculate speed if we have a previous position
        if (prev.currentPosition) {
          // Need to make sure the timestamps are different
          const timeDiffSeconds =
            newPos.timestamp - prev.currentPosition.timestamp;
          if (timeDiffSeconds > 0) {
            newSpeed = calculateSpeed(
              prev.currentPosition,
              newPos,
              timeDiffSeconds,
            );
          }
        } else if (prev.history.length > 0) {
          const lastPos = prev.history[prev.history.length - 1];
          const timeDiffSeconds = newPos.timestamp - lastPos.timestamp;
          if (timeDiffSeconds > 0) {
            newSpeed = calculateSpeed(lastPos, newPos, timeDiffSeconds);
          }
        }

        const newHistory = [...prev.history, newPos].slice(-MAX_HISTORY);

        return {
          ...prev,
          currentPosition: newPos,
          history: newHistory,
          speed: newSpeed,
          nearestPlace: placeName,
          isLoading: false,
          lastUpdated: new Date(),
        };
      });
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err.message || "Failed to fetch data",
      }));
    }
  }, []);

  const fetchAstronauts = useCallback(async () => {
    try {
      const astrosData = await api.getAstronauts();
      setState((s) => ({
        ...s,
        peopleInSpace: astrosData.number,
        astronauts: astrosData.people,
      }));
    } catch (error) {
      console.error("Failed to fetch astronauts", error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();
    fetchAstronauts();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData, fetchAstronauts]);

  useEffect(() => {
    if (state.isAutoRefresh) {
      timerRef.current = setInterval(fetchData, POLL_INTERVAL);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isAutoRefresh, fetchData]);

  const toggleAutoRefresh = () =>
    setState((s) => ({ ...s, isAutoRefresh: !s.isAutoRefresh }));
  const manualRefresh = () => fetchData();

  return {
    ...state,
    toggleAutoRefresh,
    manualRefresh,
  };
}
