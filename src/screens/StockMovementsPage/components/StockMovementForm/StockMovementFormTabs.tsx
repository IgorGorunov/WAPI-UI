import {TabFieldType} from '@/types/tabs';

export const TabTitles = (t:any, objectExists: boolean, hasTickets=false) => {
    const tabsArr = [t('general'), t('products')];
    if (objectExists) {
        tabsArr.push(t('services'));
        tabsArr.push(t('statusHistory'));
    }

    if (hasTickets) {
        tabsArr.push(t('tickets'));
    }
    tabsArr.push(t('files'));
    return tabsArr;
}
export const TabFields = (t:any) => [
    {
        tabName: t('general'),
        fieldName: 'incomingDate'
    },
    {

        tabName: t('general'),
        fieldName: 'incomingNumber'
    },
    {
        tabName: t('general'),
        fieldName: 'sender'
    },
    {
        tabName: t('general'),
        fieldName: 'senderCountry'
    },
    {
        tabName: t('general'),
        fieldName: 'receiver'
    },
    {
        tabName: t('general'),
        fieldName: 'receiverCountry'
    },
    {
        tabName: t('products'),
        fieldName: 'products'
    },
] as TabFieldType[];


