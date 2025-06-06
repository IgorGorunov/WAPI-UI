import {TabFieldType} from '@/types/tabs';
import {isTabAllowed} from "@/utils/tabs";

export const TabTitles = (objectExists: boolean, hasTickets=false, forbiddenTabs: string[]=[]) => {
    const tabsArr = [];

    ['Primary', 'Dimensions', 'Barcodes', 'Aliases', 'Virtual bundle kit', 'Analogues'].forEach(tab => {
        if (isTabAllowed(tab, forbiddenTabs)) tabsArr.push(tab);
    })

    if (objectExists && isTabAllowed('Status history', forbiddenTabs)) tabsArr.push('Status history');

    if (hasTickets && isTabAllowed('Tickets', forbiddenTabs)) tabsArr.push('Tickets');

    if (isTabAllowed('Files', forbiddenTabs)) tabsArr.push('Files');

    return tabsArr;
};

export const TabFields: TabFieldType[] = [
    {
        tabName: 'Primary',
        fieldName: 'name',
    },
    {
        tabName: 'Primary',
        fieldName: 'countryOfOrigin',
    },
    {
        tabName: 'Primary',
        fieldName:'fullName',
    },
    {
        tabName: 'Primary',
        fieldName: 'sku',
    },
    {
        tabName: 'Primary',
        fieldName: 'typeOfStorage',
    },
    {
        tabName: 'Dimensions',
        fieldName: 'unitOfMeasures',
    },
    {
        tabName: 'Dimensions',
        fieldName: 'unitOfMeasure',
    },
    {
        tabName: 'Virtual bundle kit',
        fieldName: 'bundleKit',
    },

]


