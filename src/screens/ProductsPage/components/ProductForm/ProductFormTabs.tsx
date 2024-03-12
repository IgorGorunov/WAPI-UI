import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean, hasTickets=false) => {
    const tabsArr = objectExists ? ['Primary', 'Dimensions', 'Barcodes', 'Aliases', 'Virtual bundle kit', 'Analogues', 'Status history'] : ['Primary', 'Dimensions', 'Barcodes', 'Aliases', 'Virtual bundle kit', 'Analogues'];
    if (hasTickets) {
        tabsArr.push('Tickets');
    }
    tabsArr.push('Files');
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

]


