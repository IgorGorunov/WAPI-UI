import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsProductsStock: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Click here to sort your products by clicking the name of the column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Click here to filter product stock by parameters',
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
    },
    {
        target: '.export-products',
        content: 'Click here to export product stock into Excel \n'+
        'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsProductsStockNoDocs: TourGuideStepType[] = tourGuideStepsProductsStock.slice(1);
tourGuideStepsProductsStockNoDocs[0].disableBeacon = true;