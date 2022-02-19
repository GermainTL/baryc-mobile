import { svgSource } from '~/components/BarycLoader.tsx';

// Eventually not used, should be removed ?
function generateRandomTypeOfLoader() {
  const loaderTypes = Object.keys(svgSource);
  return loaderTypes[Math.floor(Math.random() * loaderTypes.length)];
}

function getArrayDepth(value) {
  return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0;
}

function reformatCoordinates(coordinates) {
  for (const latLng in coordinates) {
    if (isNaN(coordinates[latLng][0])) {
      reformatCoordinates(coordinates[latLng]);
    } else {
      coordinates[latLng] = {
        latitude: coordinates[latLng][1],
        longitude: coordinates[latLng][0],
      };
    }
  }

  return coordinates;
}

export { generateRandomTypeOfLoader, getArrayDepth, reformatCoordinates };
