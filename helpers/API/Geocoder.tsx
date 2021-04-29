import { HTTPS_PROTOCOL } from "@env";
import axios from "axios";
const geocodingUrl = HTTPS_PROTOCOL + 'api-adresse.data.gouv.fr/search/'

export async function geocode(query: string)
{
    return await axios
        .get(geocodingUrl + '?q=' + formatQueryWithPluses(query))
        .then((response) =>
            response.data.features
        )
        .catch((error) => console.error(error))
}

function formatQueryWithPluses(query: string) {
    return query.split(' ').join('+') + '&citycode=75056&type=housenumber'
}