import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean, hasTickets=false) => {
    const tabsArr = objectExists ? ['General', 'Products', 'Services', 'Status history'] : ['General', 'Products'];
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

]


