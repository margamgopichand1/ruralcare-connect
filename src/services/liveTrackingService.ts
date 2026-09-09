export interface RouteCoordinate {
  lat: number;
  lng: number;
}

// Generate realistic polyline route waypoints between start and end coordinates with minor road bends
export function generateRouteWaypoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  numWaypoints: number = 20
): RouteCoordinate[] {
  const waypoints: RouteCoordinate[] = [];
  
  for (let i = 0; i <= numWaypoints; i++) {
    const fraction = i / numWaypoints;
    // Linear interpolation
    let lat = startLat + (endLat - startLat) * fraction;
    let lng = startLng + (endLng - startLng) * fraction;
    
    // Add subtle realistic road detour/curvatures (zero curvature at ends)
    if (i > 0 && i < numWaypoints) {
      const bend = Math.sin(fraction * Math.PI) * 0.0015;
      lat += bend * ((i % 2 === 0) ? 1 : -0.7);
      lng += bend * ((i % 3 === 0) ? -1 : 0.8);
    }
    
    waypoints.push({ lat, lng });
  }
  
  return waypoints;
}

// Given route waypoints and progress percentage (0 to 100), calculate current position, remaining distance, and ETA
export function getInterpolatedProgress(
  waypoints: RouteCoordinate[],
  progressPct: number, // 0 to 100
  totalDistanceKm: number,
  initialEtaMin: number
): {
  currentPosition: RouteCoordinate;
  remainingDistanceKm: number;
  remainingEtaMinutes: number;
  isArrived: boolean;
} {
  if (waypoints.length === 0) {
    return {
      currentPosition: { lat: 0, lng: 0 },
      remainingDistanceKm: 0,
      remainingEtaMinutes: 0,
      isArrived: true
    };
  }

  const clampedProgress = Math.min(100, Math.max(0, progressPct));
  const isArrived = clampedProgress >= 98;

  const exactIndex = (clampedProgress / 100) * (waypoints.length - 1);
  const lowerIndex = Math.floor(exactIndex);
  const upperIndex = Math.min(waypoints.length - 1, lowerIndex + 1);
  const fraction = exactIndex - lowerIndex;

  const currentLat =
    waypoints[lowerIndex].lat +
    (waypoints[upperIndex].lat - waypoints[lowerIndex].lat) * fraction;
  const currentLng =
    waypoints[lowerIndex].lng +
    (waypoints[upperIndex].lng - waypoints[lowerIndex].lng) * fraction;

  const remainingFactor = (100 - clampedProgress) / 100;
  const remainingDistanceKm = Math.max(
    0,
    parseFloat((totalDistanceKm * remainingFactor).toFixed(1))
  );
  const remainingEtaMinutes = Math.max(
    isArrived ? 0 : 1,
    Math.round(initialEtaMin * remainingFactor)
  );

  return {
    currentPosition: { lat: currentLat, lng: currentLng },
    remainingDistanceKm,
    remainingEtaMinutes,
    isArrived
  };
}
