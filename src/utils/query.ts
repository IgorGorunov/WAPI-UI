import {BasicDocListQueryType} from "@/types/utility";

export const createSetQueryFunction = (router, pathname: string) => {
    return async({addParams, removeParams}: {addParams?:BasicDocListQueryType, removeParams?: BasicDocListQueryType}) => {
        const prevQuery = router.query;
        const newQuery = {...prevQuery, ...addParams};

        await router.push({pathname: pathname, query: newQuery}, undefined, {shallow: true});
    }
}