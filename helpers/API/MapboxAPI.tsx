import axios from "axios";
import { API_TOKEN_MAPBOX, HTTPS_PROTOCOL } from "@env";
import { reformatCoordinates } from "~/helpers/CoordinatesHelper.tsx";

async function getIsochroneCoordinates(minutes: Number, coordinates: Object, meanOfTransport: String) {
    const urlMapbox =
        `${HTTPS_PROTOCOL}api.mapbox.com/isochrone/v1/mapbox/${meanOfTransport}/${coordinates.longitude},${coordinates.latitude}?contours_minutes=${minutes}&polygons=true&access_token=${API_TOKEN_MAPBOX}`

    return await axios
        .get(urlMapbox)
        .catch((error) => {
            console.error(error);
        });
}

function getIsochronesCoordinatesForCylingOrWalking(locations: any[], travelTime: Number, meanOfTransport: String): Promise {
    const isochronesCoordinatesPromises = []
    for (const index in locations) {
        if (locations[index].GPSPosition.latitude !== null) {
            isochronesCoordinatesPromises.push(getIsochroneCoordinates(travelTime, locations[index].GPSPosition, meanOfTransport))
        }
    }

    return Promise.all(isochronesCoordinatesPromises) // Promise are never resolved, why ?
        .then((apiResponses) => {
            const newIsochronesCoordinates = []
            for (const apiResponse of apiResponses) {
                newIsochronesCoordinates.push({
                    coordinates: apiResponse.data.features[0].geometry.coordinates, // useful for intersection compute
                    reformattedCoordinates: reformatCoordinates(JSON.parse(JSON.stringify(apiResponse.data.features[0].geometry.coordinates))), // useful for drawing multiPolygons
                })
            }
            return newIsochronesCoordinates
        })
        .catch((error) => {
            console.error(error);
        });
}


export { getIsochronesCoordinatesForCylingOrWalking }