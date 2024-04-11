import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsProduct: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Click here to sort your products by clicking the name of the column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Click here to filter the products by parameters',
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
    },
    {
        target: '.add-product',
        content: 'Click here to add a product. It will then be checked by our logistics manager',
        //disableBeacon: true,
    },
    {
        target: '.import-products',
        content: 'Click here to import products by bulk from Excel',
    },
    {
        target: '.export-products',
        content: 'Click here to export products into Excel \n' +
            'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsProductNoDocs: TourGuideStepType[] = tourGuideStepsProduct.slice(1);
tourGuideStepsProductNoDocs[0].disableBeacon = true;