import {TabFieldType} from '@/types/tabs';

export const TabTitles = (objectExists: boolean) =>
    objectExists ? ['General',  'Products', 'Services', 'Status history','Files'] : ['General', 'Products', 'Files'];

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


