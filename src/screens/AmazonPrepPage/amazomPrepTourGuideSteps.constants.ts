import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsAmazonPrep = (t) => {
    return [
        {
            target: '.ant-table-header', //'.product-list__container',
            content: t('step1'),
            disableBeacon: true,
        },
        {
            target: '.filter',
            content: t('step1'),
        },
        {
            target: '.date-input-field',
            content: t('step1'),
        },
        {
            target: '.search-block',
            content: t('step1'),
        },
        {
            target: '.add-order',
            content: t('step1'),
            //disableBeacon: true,
        },
        {
            target: '.export-orders',
            content: t('step1')+'  \n' +  t('step1'),
        },
    ] as TourGuideStepType[];
}

export const tourGuideStepsAmazonPrepNoDocs = (t)=> {
    const steps = tourGuideStepsAmazonPrep(t).slice(1);
    steps[0].disableBeacon = true;
    return steps;
}