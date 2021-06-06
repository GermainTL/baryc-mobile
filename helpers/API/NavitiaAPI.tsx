import axios from "axios";
import { API_TOKEN_NAVITIA, HTTPS_PROTOCOL } from "@env";
import { reformatCoordinates } from "../CoordinatesHelper.tsx";

async function getIsochroneCoordinates(minutes: Number, coordinates: Object) {
const urlNavitia =
    `${HTTPS_PROTOCOL}api.navitia.io/v1/coverage/fr-idf/isochrones?from=${coordinates.latitude};${coordinates.longitude}&min_duration=0&max_duration=${minutes * 60}`

    return await axios
        .get(urlNavitia, {
            headers: {
                Authorization: API_TOKEN_NAVITIA,
            },
        })
        .then((response) =>
            ({
                coordinates: response.data.isochrones[0].geojson.coordinates, // useful for intersection compute
                reformattedCoordinates: reformatCoordinates(JSON.parse(JSON.stringify(response.data.isochrones[0].geojson.coordinates))), // useful for drawing multiPolygons
            })
        )
        .catch((error) => {
            console.log(error);
        });
}

async function getIsochronesCoordinates(locations: any[], travelTime: Number) {
    return await new Promise(async resolve => {
        let newIsochronesCoordinates: any[];
        newIsochronesCoordinates = [];
        for (const index in locations) {
            if (locations[index].GPSPosition.latitude !== null) {
                getIsochroneCoordinates(travelTime, locations[index].GPSPosition).then((newIsochroneCoordinates) => {
                    newIsochronesCoordinates.push(newIsochroneCoordinates)
                })
            }
        }
        resolve(newIsochronesCoordinates)
    })
}


export { getIsochronesCoordinates }