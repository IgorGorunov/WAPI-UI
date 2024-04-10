import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsProduct: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your products by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Here you can filter the products',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-product',
        content: 'Here you can add a product. It will then be checked by our logistics manager',
        //disableBeacon: true,
    },
    {
        target: '.import-products',
        content: 'Here you can import products by bulk from Excel',
    },
    {
        target: '.export-products',
        content: 'Here you can export products into Excel \n' +
            'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsProductNoDocs: TourGuideStepType[] = [
    {
        target: '.filter',
        content: 'Here you can filter the products',
        disableBeacon: true,
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-product',
        content: 'Here you can add a product. It will then be checked by our logistics manager',
        //disableBeacon: true,
    },
    {
        target: '.import-products',
        content: 'Here you can import products by bulk from Excel',
    },
    {
        target: '.export-products',
        content: 'Here you can export products into Excel \n' +
            'Note: All filters will be applied into export file',
    },
]