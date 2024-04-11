import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsOrders: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Click here to sort your orders by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Click here to filter orders by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Click here to filter your orders by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
    },
    {
        target: '.add-order',
        content: 'Click here to create an order by filling out the form',
        //disableBeacon: true,
    },
    {
        target: '.import-orders',
        content: 'Click here to import your orders by bulk from Excel',
    },
    {
        target: '.export-orders',
        content: 'Click here to export orders into Excel  \n' +
            'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsOrdersNoDocs: TourGuideStepType[] = tourGuideStepsOrders.slice(1);
tourGuideStepsOrdersNoDocs[0].disableBeacon = true;