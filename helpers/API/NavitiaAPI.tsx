import axios from "axios";
import { API_TOKEN_NAVITIA, HTTPS_PROTOCOL } from "@env";

async function getIsochronesCoordinates(minutes: Number, coordinates: Object) {
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
                reformattedCoordinates: reformatCoordinates(response.data.isochrones[0].geojson.coordinates), // useful for drawing multiPolygons
                coordinates: response.data.isochrones[0].geojson.coordinates // useful for intersection compute
            })
        )
        .catch((error) => {
            console.log(error);
        });
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

export { reformatCoordinates, getIsochronesCoordinates }