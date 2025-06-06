import {TabFieldType} from '@/types/tabs';
import {isTabAllowed} from "@/utils/tabs";


export const TabTitles = (objectExists: boolean, hasClaim=false, hasReturns=false, hasTickets=false, forbiddenTabs: string[] =[]) => {

    const tabArray = [];

    ['General', 'Delivery info', 'Products'].forEach(tabName => {
        if (isTabAllowed(tabName, forbiddenTabs)) {
            tabArray.push(tabName);
        }
    })

    if (objectExists) {
        ['Services', 'Status history', 'SMS history'].forEach(tabName => {
            if (isTabAllowed(tabName, forbiddenTabs)) {
                tabArray.push(tabName);
            }
        })
    };

    if (hasClaim && isTabAllowed('Claims', forbiddenTabs)) {
        tabArray.push('Claims');
    }

    if (hasReturns && isTabAllowed('Customer returns', forbiddenTabs)) {
        tabArray.push('Customer returns');
    }

    if (hasTickets && isTabAllowed('Tickets', forbiddenTabs)) {
        tabArray.push('Tickets');
    }

    if (objectExists && isTabAllowed('Notes', forbiddenTabs)) {
        tabArray.push('Notes');
    }

    if (isTabAllowed('Files', forbiddenTabs)) tabArray.push('Files');

    return tabArray;
}

export const TabFields: TabFieldType[] = [
    {
        tabName: 'General',
        fieldName: 'date'
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
    {
        tabName: 'Products',
        fieldName: 'codCurrency'
    },
    {
        tabName: 'Products',
        fieldName: 'products'
    },

]


