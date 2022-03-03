import * as turf from '@turf/turf';
import { getBarsFromApi } from './API/BarsAPI.tsx';
import { getMarkersFromBars } from '~/helpers/MarkersHelper.tsx';
import { getArrayDepth, reformatCoordinates } from '~/helpers/utils.tsx';
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
    if (intersection == null) {
      resolve(null)
    }

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

async function retrieveNewMapElements(
  locations: any[],
  travelTime: Number,
  meanOfTransport: String,
): Promise {
  let newIntersection = null;
  let newIsochronesCoordinates = [];
  let newMarkers = [];

  const shouldUseMapbox = ['cycling', 'walking'].includes(meanOfTransport);
  let isochronesCoordinates = [];
  if (shouldUseMapbox) {
    isochronesCoordinates = await getIsochronesCoordinatesForCylingOrWalking(
      locations,
      travelTime,
      meanOfTransport,
    );
  } else {
    isochronesCoordinates = await getIsochronesCoordinates(
      locations,
      travelTime,
      meanOfTransport,
    );
  }
  newIsochronesCoordinates = isochronesCoordinates;
  if (newIsochronesCoordinates.length > 1) {
    newIntersection = await getIntersection(newIsochronesCoordinates);
  }

  const bars = await getBarsFromApi();
  if (newIntersection) {
    const barsInPolygon = await findBarsInPolygon(
      bars,
      newIntersection.coordinates,
    );

    const action = { type: 'UPDATE_BARS', bars: barsInPolygon };
    store.dispatch(action);
    newMarkers = getMarkersFromBars(barsInPolygon);
  } else {
    const barsInPolygonPromises = [];
    for (const newIsochroneCoordinate of newIsochronesCoordinates) {
      barsInPolygonPromises.push(
        findBarsInPolygon(bars, newIsochroneCoordinate.coordinates),
      );
    }

    const barsInPolygons = await Promise.all(barsInPolygonPromises);
    const newBarsInPolygon = [];
    for (const barsInPolygon of barsInPolygons) {
      newBarsInPolygon.push(...barsInPolygon);
    }
    const action = { type: 'UPDATE_BARS', bars: newBarsInPolygon };
    store.dispatch(action);
    newMarkers = getMarkersFromBars(newBarsInPolygon);
  }

  return {
    newIsochronesCoordinates: newIsochronesCoordinates,
    newIntersection: newIntersection,
    newMarkers: newMarkers,
  };
}

const multiPolygonDepth = 4;
const polygonDepth = 3;

export {
  getIntersection,
  reformatCoordinates,
  findBarsInPolygon,
  retrieveNewMapElements,
  multiPolygonDepth,
  polygonDepth,
};
