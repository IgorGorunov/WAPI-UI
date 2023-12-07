import {TabFieldType} from '@/types/tabs';
import {PRODUCT} from "./ProductFormFields";

export const TabTitles = (objectExists: boolean) =>
    objectExists ? ['Primary','Dimensions', 'Barcodes', 'Aliases', 'Bundle kit', 'Analogues', 'Status history', 'Files'] : ['Primary','Dimensions', 'Barcodes', 'Aliases', 'Bundle kit', 'Analogues', 'Status history', 'Files'];

export const TabFields: TabFieldType[] = [
    {
        tabName: 'Primary',
        fieldName: PRODUCT.name,
    },
    {
        tabName: 'Primary',
        fieldName:  PRODUCT.countryOfOrigin,
    },
    {
        tabName: 'Primary',
        fieldName: PRODUCT.fullName,
    },
    {
        tabName: 'Primary',
        fieldName: PRODUCT.SKU,
    },
    {
        tabName: 'Primary',
        fieldName: PRODUCT.typeOfStorage,
    },

]


