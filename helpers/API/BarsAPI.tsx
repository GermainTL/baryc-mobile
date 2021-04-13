import axios from "axios";
import { BARYC_AWS_API_KEY } from "@env";

export async function getBarsFromApi() {
    const path = "/bars";
    const url =
        "https://f3n48sbbli.execute-api.eu-west-1.amazonaws.com/v1" + path;
    const bars: Object[] = []
    return await axios
    .get(url, {
        headers: {
            'x-api-key': BARYC_AWS_API_KEY
        }
    })
    .then(response =>
        response = JSON.parse(response.data.body)
    )
    .catch((error) => console.error(error)) // TODO : errors should be displayed to user with a component conditionnaly displayed by a Redux store state variable
}