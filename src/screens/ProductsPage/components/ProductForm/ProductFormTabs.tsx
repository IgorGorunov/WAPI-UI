import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean) =>
    objectExists ? ['Primary','Dimensions', 'Barcodes', 'Aliases', 'Bundle kit', 'Analogues', 'Status history', 'Files'] : ['Primary','Dimensions', 'Barcodes', 'Aliases', 'Bundle kit', 'Analogues', 'Status history', 'Files'];

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

]


