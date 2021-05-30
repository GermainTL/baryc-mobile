import * as turf from "@turf/turf";

function getIntersection(isochronesCoordinates: any[]): Promise
{
    return new Promise(resolve => {
        const turfMultiPolygons = [];
        for (const isochroneCoordinates of isochronesCoordinates) {
            turfMultiPolygons.push(turf.multiPolygon(isochroneCoordinates.coordinates))
        }
        const intersection = computeIntersection(turfMultiPolygons)
        const reformattedCoordinates =
            intersection !== null ? reformatCoordinates(intersection.geometry.coordinates) : null
        resolve(reformattedCoordinates)
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


export { getIntersection, reformatCoordinates }