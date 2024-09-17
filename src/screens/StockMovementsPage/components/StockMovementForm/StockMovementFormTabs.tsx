import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean, hasTickets=false) => {
    const tabsArr = objectExists ? ['General', 'Cargo info', 'Products', 'Services', 'Status history'] : ['General', 'Cargo info', 'Products'];
    if (hasTickets) {
        tabsArr.push('Tickets');
    }
    tabsArr.push('Files');
    return tabsArr;
}
export const TabFields: TabFieldType[] = [
    {
        tabName: 'General',
        fieldName: 'incomingDate'
    },
    {
        tabName: 'General',
        fieldName: 'incomingNumber'
    },
    {
        tabName: 'General',
        fieldName: 'sender'
    },
    {
        tabName: 'General',
        fieldName: 'senderCountry'
    },
    {
        tabName: 'General',
        fieldName: 'receiver'
    },
    {
        tabName: 'General',
        fieldName: 'receiverCountry'
    },
    {
        tabName: 'Products',
        fieldName: 'products'
    },
    {
        tabName: 'Cargo info',
        fieldName: 'deliveryMethod'
    },
    {
        tabName: 'Cargo info',
        fieldName: 'palletsAmount'
    },
    {
        tabName: 'Cargo info',
        fieldName: 'cartonsAmount'
    },
    {
        tabName: 'Cargo info',
        fieldName: 'container20Amount'
    },
    {
        tabName: 'Cargo info',
        fieldName: 'container40Amount'
    },

]


