import {TabFieldType} from '@/types/tabs';

export const TabTitles = (t, objectExists: boolean, hasTickets=false) => {
    const tabsArr = objectExists ? [t('primary'), t('dimensions'), t('barcodes'), t('aliases'), t('bundle'), t('analogues'), t('statusHistory')] : [t('primary'), t('dimensions'), t('barcodes'), t('aliases'), t('bundle'), t('analogues')];
    if (hasTickets) {
        tabsArr.push(t('tickets'));
    }
    tabsArr.push(t('files'));
    return tabsArr;

};
export const TabFields = (t) => {
    return [
        {
            tabName: t('primary'),
            fieldName: 'name',
        },
        {
            tabName: t('primary'),
            fieldName: 'countryOfOrigin',
        },
        {
            tabName: t('primary'),
            fieldName:'fullName',
        },
        {
            tabName: t('primary'),
            fieldName: 'sku',
        },
        {
            tabName: 'Primary',
            fieldName: 'typeOfStorage',
        },
        {
            tabName: t('dimensions'),
            fieldName: 'unitOfMeasures',
        },
        {
            tabName: t('dimensions'),
            fieldName: 'unitOfMeasure',
        },
        {
            tabName: t('bundle'),
            fieldName: 'bundleKit',
        },

    ] as TabFieldType[]
}


