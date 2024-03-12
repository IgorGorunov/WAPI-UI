import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean, hasTickets=false) => {
    const tabsArr = objectExists ? ['General', 'Delivery info', 'Products', 'Pallets', 'Services', 'Status history'] : ['General', 'Delivery info', 'Products'];

    if (hasTickets) {
        tabsArr.push('Tickets');
    }

    tabsArr.push('Files');

    return tabsArr;
};
export const TabFields: TabFieldType[] = [
    {
        tabName: 'General',
        fieldName: 'date'
    },
    {
        tabName: 'Delivery info',
        fieldName: 'asnNumber',
    },
    {
        tabName: 'Delivery info',
        fieldName: 'warehouse',
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


]


