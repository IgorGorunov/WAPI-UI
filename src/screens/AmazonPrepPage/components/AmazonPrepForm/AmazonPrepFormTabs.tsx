import {TabFieldType} from '@/types/tabs';
import {isTabAllowed} from "@/utils/tabs";

export const TabTitles = (objectExists: boolean, hasTickets=false, forbiddenTabs: string[]) => {
    const tabsArr = [];

    ['General', 'Delivery info', 'Products'].forEach(tabName => {
        if (isTabAllowed(tabName, forbiddenTabs)) tabsArr.push(tabName);
    })

    if (objectExists) {
        ['Pallets', 'Services', 'Status history'].forEach(tabName => {
            if (isTabAllowed(tabName, forbiddenTabs)) tabsArr.push(tabName);
        });
    }

    if (hasTickets && isTabAllowed('Tickets', forbiddenTabs)) {
        tabsArr.push('Tickets');
    }

    if (isTabAllowed('Files', forbiddenTabs)) tabsArr.push('Files');

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


