import {ParsedUrlQuery} from "node:querystring";

export const getCleanParamsFromQuery = (query: ParsedUrlQuery) => {
    const rez = {};
    const keys = Object.keys(query);
    keys.map(key => {
        rez[key.replace('amp;','')]=Array.isArray(query[key]) ? query[key][0] : query[key] ;
    })

    return rez;
}