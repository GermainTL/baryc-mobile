import * as turf from '@turf/turf';
import { getBarsFromApi } from './API/BarsAPI.tsx';
import { getMarkersFromBars } from '~/helpers/MarkersHelper.tsx';

import { getIsochronesCoordinates } from '~/helpers/API/NavitiaAPI.tsx';
import { getIsochronesCoordinatesForCylingOrWalking } from '~/helpers/API/MapboxAPI.tsx';
import store from '~/store/createStore.tsx';

function getIntersection(isochronesCoordinates: any[]): Promise {
  return new Promise(resolve => {
    const turfMultiPolygons = [];

    for (const isochroneCoordinates of isochronesCoordinates) {
      const isochroneDepth = getArrayDepth(isochroneCoordinates.coordinates);
      if (
        isochroneDepth === multiPolygonDepth ||
        isochroneDepth === polygonDepth
      ) {
        const isMultiPolygon = isochroneDepth === multiPolygonDepth;
        turfMultiPolygons.push(
          isMultiPolygon
            ? turf.multiPolygon(isochroneCoordinates.coordinates)
            : turf.polygon(isochroneCoordinates.coordinates),
        );
      }
    }
    const intersection = computeIntersection(turfMultiPolygons);

    const rawCoordinates = JSON.parse(
      JSON.stringify(intersection.geometry.coordinates),
    );
    const reformattedCoordinates =
      intersection !== null
        ? reformatCoordinates(intersection.geometry.coordinates)
        : null;
    resolve(
      intersection !== null
        ? {
            coordinates: rawCoordinates,
            reformattedCoordinates: reformattedCoordinates,
          }
        : null,
    );
  });
}

// turfPolygon arg can be either polygon or multiPolygon
function computeIntersection(turfPolygons: any[]) {
  if (turfPolygons.length > 2) {
    turfPolygons[0] = turf.intersect(turfPolygons[0], turfPolygons[1]);
    computeIntersection(turfPolygons);
  } else {
    return turf.intersect(turfPolygons[0], turfPolygons[1]);
  }
}

function findBarsInPolygon(
  bars: any[],
  multiPolygonCoordinates: any[],
): Promise {
  return new Promise(resolve => {
    const barsInPolygon = [];
    let polygon = null;
    if (getArrayDepth(multiPolygonCoordinates) === multiPolygonDepth) {
      polygon = turf.multiPolygon(multiPolygonCoordinates);
    } else if (getArrayDepth(multiPolygonCoordinates) === polygonDepth) {
      polygon = turf.polygon(multiPolygonCoordinates);
    }

    for (const bar of bars) {
      if (turf.booleanPointInPolygon(turf.point(bar.coordinates), polygon)) {
        barsInPolygon.push(bar);
      }
    }
    resolve(barsInPolygon);
  });
}

function retrieveNewMapElements(
  locations: any[],
  travelTime: Number,
  meanOfTransport: String,
): Promise {
  return new Promise(resolve => {
    let newIntersection = null;
    let newIsochronesCoordinates = [];
    let newMarkers = [];

    let isochroneCoordinatePromises = null;
    const shouldUseMapbox = ['cycling', 'walking'].includes(meanOfTransport);
    if (shouldUseMapbox) {
      isochroneCoordinatePromises = getIsochronesCoordinatesForCylingOrWalking(
        locations,
        travelTime,
        meanOfTransport,
      );
    } else {
      isochroneCoordinatePromises = getIsochronesCoordinates(
        locations,
        travelTime,
        meanOfTransport,
      );
    }
    isochroneCoordinatePromises
      .then(isochronesCoordinates => {
        newIsochronesCoordinates = isochronesCoordinates;
        if (newIsochronesCoordinates.length > 1) {
          getIntersection(newIsochronesCoordinates).then(
            (intersection: any[] | null) => {
              newIntersection = intersection;
            },
          );
        }
      })
      .then(() => {
        return getBarsFromApi();
      })
      .then(bars => {
        if (newIntersection) {
          findBarsInPolygon(bars, newIntersection.coordinates).then(
            barsInPolygon => {
              const action = { type: 'UPDATE_BARS', bars: barsInPolygon };
              store.dispatch(action);
              newMarkers = getMarkersFromBars(barsInPolygon);
            },
          );
        } else {
          const barsInPolygonPromises = [];
          for (const newIsochroneCoordinate of newIsochronesCoordinates) {
            barsInPolygonPromises.push(
              findBarsInPolygon(bars, newIsochroneCoordinate.coordinates),
            );
          }
          Promise.all(barsInPolygonPromises).then(barsInPolygons => {
            const newBarsInPolygon = [];
            for (const barsInPolygon of barsInPolygons) {
              newBarsInPolygon.push(...barsInPolygon);
            }
            const action = { type: 'UPDATE_BARS', bars: newBarsInPolygon };
            store.dispatch(action);
            newMarkers = getMarkersFromBars(newBarsInPolygon);
          });
        }
      })
      .then(() => {
        resolve({
          newIsochronesCoordinates: newIsochronesCoordinates,
          newIntersection: newIntersection,
          newMarkers: newMarkers,
        });
      });
  });
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

function getArrayDepth(value) {
  return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0;
}

const multiPolygonDepth = 4;
const polygonDepth = 3;

export {
  getIntersection,
  reformatCoordinates,
  findBarsInPolygon,
  retrieveNewMapElements,
  getArrayDepth,
  multiPolygonDepth,
  polygonDepth,
};
