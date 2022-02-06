export function getMarkersFromBars(bars: any) {
  const markers = [];
  for (const bar of bars) {
    markers.push({
      coordinates: {
        longitude: bar.coordinates[0],
        latitude: bar.coordinates[1],
      },
      title: bar.nom,
      key: bar.id,
    });
  }
  return markers;
}

export function getMarkersFromLocations(locations: any): any {
  const markers = [];
  locations.forEach((location, locationIndex) => {
    if (location.GPSPosition.longitude && location.GPSPosition.latitude) {
      markers.push({
        coordinates: {
          longitude: location.GPSPosition.longitude,
          latitude: location.GPSPosition.latitude,
        },
        key:
          locationIndex +
          location.GPSPosition.longitude +
          location.GPSPosition.latitude,
      });
    }
  });

  return markers;
}
