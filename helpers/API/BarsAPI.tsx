import axios from "axios";
import { BARYC_AWS_API_KEY, HTTPS_PROTOCOL } from "@env";
import store from "~/store/createStore.tsx";

export async function getBarsFromApi() {
    const path = "/bars";
    const url =
        HTTPS_PROTOCOL + "f3n48sbbli.execute-api.eu-west-1.amazonaws.com/v1" + path;
    return await axios
    .get(url, {
        headers: {
            'x-api-key': BARYC_AWS_API_KEY
        }
    })
    .then(response => {
            const bars = JSON.parse(response.data.body)
            const action = { type: "UPDATE_BARS", bars: bars }
            store.dispatch(action)
            return bars
        }
    )
    .catch((error) => console.error(error)) // TODO : errors should be displayed to user with a component conditionnaly displayed by a Redux store state variable
}

export function getMarkersFromBars(bars: any) {
    const markers = []
    for (const bar of bars) {
        markers.push({
            coordinates: {
                longitude: bar.coordinates[0],
                latitude: bar.coordinates[1],
            },
            title: bar.nom,
            key: bar.id
        })
    }
    return markers
}