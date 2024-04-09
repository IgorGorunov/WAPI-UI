import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsAmazonPrep: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your orders by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Here you can filter orders by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Here you can filter your orders by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-order',
        content: 'Here you can create an order by filling out the form',
        //disableBeacon: true,
    },
    {
        target: '.export-orders',
        content: 'Here you can export orders into Excel \n' +
            'Note: All filters will be applied into export file',
    },
]