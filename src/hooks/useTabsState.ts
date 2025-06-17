import { useState } from 'react';

import {TabFieldType, TabTitleType} from "@/types/tabs";

export const useTabsState = (tabTitleArray: string[], tabFields: TabFieldType[]) => {

    const noErrors= tabTitleArray.map((item: string)=>({title: item, hasError: false} as TabTitleType));
    const [initialState, setInitialState] = useState(noErrors);
    //const initialState = tabTitleArray.map((item: string)=>({title: item, hasError: false} as TabTitleType));

    const [tabTitles, setTabTitles] = useState(initialState);

    const updateTabTitles = (errorFields: string[]) => {
        console.log('tabs update: ', initialState);
        // const updatedState = [...initialState];
        const updatedState = [...noErrors];
        errorFields.forEach((errorField) => {
            const field = tabFields.find(field => field.fieldName === errorField);
            if (field && field.tabName) {
                const state = updatedState.find(tab=>tab.title === field.tabName);
                if (state) {
                    state.hasError = true;
                }
            }
        })

        setTabTitles(updatedState);
    }

    const clearTabTitles = () => {
        console.log('clear tabs');
        setInitialState(noErrors);
        setTabTitles(noErrors)
    }

    const resetTabTables = (newTabTitleArray: string[]) => {
        const newInitState = newTabTitleArray.map((item: string)=>({title: item, hasError: false} as TabTitleType));
        setInitialState(newInitState);
        setTabTitles(newInitState);
    }

    return {tabTitles, updateTabTitles, clearTabTitles, resetTabTables};
}
