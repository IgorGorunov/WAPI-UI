import {TabFieldType} from '@/types/tabs';

export const TabTitles = (t, objectExists: boolean, hasClaim=false, hasTickets=false) => {

    const tabArray = [t('general'), t('deliveryInfo'), t('products')]

    if (objectExists) {
        tabArray.push(t('services'));
        tabArray.push(t('statusHistory'));
        tabArray.push(t('smsHistory'));
    }

    if (hasClaim) {
        tabArray.push(t('claims'));
    }
    if (hasTickets) {
        tabArray.push(t('tickets'));
    }

    if (objectExists) {
        tabArray.push(t('notes'));
    }

    tabArray.push(t('files'));

    return tabArray;
}

export const TabFields = (t) => {
    return [
        {
            tabName: t('general'),
            fieldName: 'date'
        },
        {
            tabName: t('deliveryInfo'),
            fieldName: 'receiverCountry'
        },
        {
            tabName: t('deliveryInfo'),
            fieldName: 'receiverCity'
        },
        {
            tabName: t('deliveryInfo'),
            fieldName: 'receiverZip'
        },
        {
            tabName: t('deliveryInfo'),
            fieldName: 'receiverAddress'
        },
        {
            tabName: t('deliveryInfo'),
            fieldName: 'receiverPhone'
        },
        {
            tabName: t('deliveryInfo'),
            fieldName: 'receiverFullName'
        },
        {
            tabName: t('products'),
            fieldName: 'codCurrency'
        },
        {
            tabName: t('products'),
            fieldName: 'products'
        },

    ] as TabFieldType[]
}


