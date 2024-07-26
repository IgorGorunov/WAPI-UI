import {TabFieldType} from '@/types/tabs';

export const TabTitles = (t: any, objectExists: boolean, hasTickets=false) => {
    const tabsArr = [t('general'), t('deliveryInfo'), t('products')];

    if (objectExists) {
        tabsArr.push(t('pallets'));
        tabsArr.push(t('services'));
        tabsArr.push(t('statusHistory'));
    }

    if (hasTickets) {
        tabsArr.push(t('tickets'));
    }

    tabsArr.push(t('files'));

    return tabsArr;
};
export const TabFields = (t) => [
    {
        tabName: t('general'),
        fieldName: 'date'
    },
    {
        tabName: t('deliveryInfo'),
        fieldName: 'asnNumber',
    },
    {
        tabName: t('deliveryInfo'),
        fieldName: 'warehouse',
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


] as TabFieldType[]


