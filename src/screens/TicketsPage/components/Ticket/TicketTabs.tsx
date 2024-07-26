import {TabFieldType} from '@/types/tabs';

export const TabTitles = (t, isNew: boolean) => {
    return isNew ? [t('ticketInfo')] : [t('ticketInfo'), t('messages')];
}

export const TabFields = (t) => [
    {
        tabName: t('ticketInfo'),
        fieldName: 'topic'
    },
    {
        tabName: t('ticketInfo'),
        fieldName: 'subject'
    },
    {
        tabName: t('ticketInfo'),
        fieldName: 'description'
    },
] as TabFieldType[];