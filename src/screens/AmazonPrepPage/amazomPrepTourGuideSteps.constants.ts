import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsAmazonPrep: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort orders by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Click here to filter orders by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Click here to filter orders by the period of time',
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
        target: '.export-orders',
        content: 'Click here to export orders into Excel  \n' +
            'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsAmazonPrepNoDocs: TourGuideStepType[] = tourGuideStepsAmazonPrep.slice(1);
tourGuideStepsAmazonPrepNoDocs[0].disableBeacon = true;