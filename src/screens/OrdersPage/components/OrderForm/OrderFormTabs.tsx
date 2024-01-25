import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean, hasClaim=false) => {

    const tabArray = objectExists ? ['General', 'Delivery info', 'Products', 'Services', 'Status history', 'SMS history'] : ['General', 'Delivery info', 'Products', 'Files'];

    if (hasClaim) {
        tabArray.push('Claims');
    }
    tabArray.push('Files');

    return tabArray
;
}

export const TabFields: TabFieldType[] = [
    {
        tabName: 'General',
        fieldName: 'date'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'receiverCountry'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'receiverCity'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'receiverZip'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'receiverAddress'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'receiverPhone'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'receiverFullName'
    },
    {
        tabName: 'Products',
        fieldName: 'codCurrency'
    },
    {
        tabName: 'Products',
        fieldName: 'products'
    },

]


