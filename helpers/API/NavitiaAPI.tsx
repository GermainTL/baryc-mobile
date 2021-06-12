import axios from "axios";
import { API_TOKEN_NAVITIA, HTTPS_PROTOCOL } from "@env";
import { reformatCoordinates } from "~/helpers/CoordinatesHelper.tsx";

async function getIsochroneCoordinates(minutes: Number, coordinates: Object) {
        const urlNavitia =
            `${HTTPS_PROTOCOL}api.navitia.io/v1/coverage/fr-idf/isochrones?from=${coordinates.latitude};${coordinates.longitude}&min_duration=0&max_duration=${minutes * 60}`
        return await axios
                    .get(urlNavitia, {
                        headers: {
                            Authorization: API_TOKEN_NAVITIA,
                        },
                    })
}

function getIsochronesCoordinates(locations: any[], travelTime: Number): Promise {
        const isochronesCoordinatesPromises = []
        for (const index in locations) {
            if (locations[index].GPSPosition.latitude !== null) {
                isochronesCoordinatesPromises.push(getIsochroneCoordinates(travelTime, locations[index].GPSPosition))
            }
        }
        return Promise.all(isochronesCoordinatesPromises) // More than 2 promises are never resolved, why ?
                .then((apiResponses) => {
                    const newIsochronesCoordinates = []
                    for (const apiResponse of apiResponses) {
                        newIsochronesCoordinates.push({
                            coordinates: apiResponse.data.isochrones[0].geojson.coordinates, // useful for intersection compute
                            reformattedCoordinates: reformatCoordinates(JSON.parse(JSON.stringify(apiResponse.data.isochrones[0].geojson.coordinates))), // useful for drawing multiPolygons
                        })
                    }
                    return newIsochronesCoordinates
                 })
                .catch((error) => {
                    console.error(error);
                });
}


export { getIsochronesCoordinates }