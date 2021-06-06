import * as turf from "@turf/turf";
import { getBarsFromApi, getMarkersFromBars } from "./API/BarsAPI.tsx";
import { getIsochronesCoordinates } from "~/helpers/API/NavitiaAPI.tsx";

function getIntersection(isochronesCoordinates: any[]): Promise
{
    return new Promise(resolve => {
        const turfMultiPolygons = [];
        for (const isochroneCoordinates of isochronesCoordinates) {
            turfMultiPolygons.push(turf.multiPolygon(isochroneCoordinates.coordinates))
        }
        const intersection = computeIntersection(turfMultiPolygons)

        const rawCoordinates = JSON.parse(JSON.stringify(intersection.geometry.coordinates))
        const reformattedCoordinates =
            intersection !== null ? reformatCoordinates(intersection.geometry.coordinates) : null
        resolve({ coordinates: rawCoordinates, reformattedCoordinates: reformattedCoordinates } )
    })
}

function computeIntersection(turfMultiPolygons: any[]) {
    if (turfMultiPolygons.length > 2) {
        turfMultiPolygons[0] = turf.intersect(turfMultiPolygons[0], turfMultiPolygons[1])
        computeIntersection(turfMultiPolygons)
    } else {
        return turf.intersect(turfMultiPolygons[0], turfMultiPolygons[1])
    }
}

function findBarsInPolygon(bars: any[], multiPolygonCoordinates: any[]): Promise {
        return new Promise(resolve => {
            const barsInPolygon = []
            const polygon = turf.multiPolygon(multiPolygonCoordinates)
            for (const bar of bars) {
                if (turf.booleanPointInPolygon(turf.point(bar.coordinates), polygon)) {
                    barsInPolygon.push(bar)
                }
            }
            resolve(barsInPolygon)
        })
}

function retrieveNewMapElements(locations: any[], travelTime: Number): Promise {
    return new Promise(resolve => {
        let newIntersection = null
        let newIsochronesCoordinates = []
        let newMarkers = []

        getIsochronesCoordinates(locations, travelTime)
            .then((isochronesCoordinates) => {
                newIsochronesCoordinates = isochronesCoordinates
                if (newIsochronesCoordinates.length > 1) {
                    getIntersection(newIsochronesCoordinates).then((intersection: any[]) => {
                        newIntersection = intersection
                    })
                }
            })
            .then(() => {
                return getBarsFromApi()
            })
            .then((bars) => {
                if (newIntersection) {
                    findBarsInPolygon(bars, newIntersection.coordinates).then((barsInPolygon) => {
                        newMarkers = getMarkersFromBars(barsInPolygon)
                    })
                } else {
                    // what to do when no intersection exists ?
                }
            })
            .then(() => {
                resolve({ newIsochronesCoordinates: newIsochronesCoordinates, newIntersection: newIntersection, newMarkers: newMarkers })
            })
    })
}

function reformatCoordinates(coordinates) {
    for (const latLng in coordinates) {
        if (isNaN(coordinates[latLng][0])) {
            reformatCoordinates(coordinates[latLng])
        } else {
            coordinates[latLng] = {
                latitude: coordinates[latLng][1],
                longitude: coordinates[latLng][0]
            }
        }
    }

    return coordinates
}


export { getIntersection, reformatCoordinates, findBarsInPolygon, retrieveNewMapElements }