import axios from "axios";
import { API_TOKEN_NAVITIA, HTTPS_PROTOCOL } from "@env";
import { reformatCoordinates } from "../CoordinatesHelper.tsx";

function getIsochroneCoordinates(minutes: Number, coordinates: Object): Promise {
    return new Promise( (resolve, reject) => {
        const urlNavitia =
            `${HTTPS_PROTOCOL}api.navitia.io/v1/coverage/fr-idf/isochrones?from=${coordinates.latitude};${coordinates.longitude}&min_duration=0&max_duration=${minutes * 60}`
        axios
            .get(urlNavitia, {
                headers: {
                    Authorization: API_TOKEN_NAVITIA,
                },
            })
            .then((response) =>
                resolve({
                    coordinates: response.data.isochrones[0].geojson.coordinates, // useful for intersection compute
                    reformattedCoordinates: reformatCoordinates(JSON.parse(JSON.stringify(response.data.isochrones[0].geojson.coordinates))), // useful for drawing multiPolygons
                })
            )
            .catch((error) => {
                reject(error);
            });
    })
}

function getIsochronesCoordinates(locations: any[], travelTime: Number): Promise {
    return new Promise( async resolve => {
        const getIsochronesCoordinates = []
        for (const index in locations) {
            if (locations[index].GPSPosition.latitude !== null) {
                getIsochronesCoordinates.push(getIsochroneCoordinates(travelTime, locations[index].GPSPosition))
            }
        }
        Promise.all(getIsochronesCoordinates) // Promise are never resolved, why ?
            .then((newIsochronesCoordinates) => {
                resolve(newIsochronesCoordinates)
             })
            .catch((error) => {
                console.error(error);
            });
    })
}


export { getIsochronesCoordinates }