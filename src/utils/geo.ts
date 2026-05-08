export interface Position {
  lat: number;
  lng: number;
  timestamp: number;
}

export function calculateSpeed(pos1: Position, pos2: Position, timeDiffSeconds: number) {
  // Provided by user
  const R = 6371;

  const toRad = (deg: number) => deg * (Math.PI / 180);

  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  const speedKmh = (distance / timeDiffSeconds) * 3600;

  return speedKmh;
}
