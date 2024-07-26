import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsProductsStock = (t) => {

    return [
        {
            target: '.ant-table-header', //'.product-list__container',
            content: t('step1'),
            disableBeacon: true,
        },
        {
            target: '.filter',
            content: t('step2'),
        },
        {
            target: '.search-block',
            content: t('step3'),
        },
        {
            target: '.export-products',
            content: `${t('step4-1')} \n
                ${t('step4-2')}`,
        },
    ] as TourGuideStepType[];
}

export const tourGuideStepsProductsStockNoDocs = (t) => {
    const steps = tourGuideStepsProductsStock(t).slice(1);
    steps[0].disableBeacon = true;
    return steps;
}