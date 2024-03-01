import {TabFieldType} from '@/types/tabs';

export const TabTitles = (isNew: boolean) => {

    return isNew ? ['Ticket info'] : ['Ticket info', 'Messages'];
}

export const TabFields: TabFieldType[] = [
    {
        tabName: 'Ticket info',
        fieldName: 'topic'
    },
    {
        tabName: 'Ticket info',
        fieldName: 'subject'
    },
    {
        tabName: 'Ticket info',
        fieldName: 'description'
    },
]