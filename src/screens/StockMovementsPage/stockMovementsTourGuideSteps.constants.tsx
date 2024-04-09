import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsStockMovements  = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your documents by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Here you can filter documents by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Here you can filter your documents by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-doc',
        content: 'Here you can create a document by filling out the form',
        //disableBeacon: true,
    },
    {
        target: '.export-docs',
        content: 'Here you can export documents into Excel \n' +
            'Note: All filters will be applied into export file',
    },
];
