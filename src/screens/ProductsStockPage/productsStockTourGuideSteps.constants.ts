import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsProductsStock: TourGuideStepType[] = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your products by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Here you can filter your product stock by warehouse or country',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.export-products',
        content: 'Here you can download a report based on the chosen filters',
    },
]