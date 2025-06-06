import {TabFieldType} from '@/types/tabs';
import {isTabAllowed} from "@/utils/tabs";

export const TabTitles = (objectExists: boolean, hasTickets=false, forbiddenTabs: string[]) => {
    const tabsArr = [];

    ['General', 'Cargo info', 'Products'].forEach(tabName => {
        if (isTabAllowed(tabName, forbiddenTabs)) tabsArr.push(tabName);
    } );

    if (objectExists) {
        ['Services', 'Status history'].forEach(tabName => {
            if (isTabAllowed(tabName, forbiddenTabs)) tabsArr.push(tabName);
        })
    }
    if (hasTickets && isTabAllowed('Tickets', forbiddenTabs)) {
        tabsArr.push('Tickets');
    }

    if (isTabAllowed('Files', forbiddenTabs)) tabsArr.push('Files');

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


