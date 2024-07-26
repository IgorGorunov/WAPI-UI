import {TourGuideStepType} from "@/types/tourGuide";
import {useTranslations} from "next-intl";

export const tourGuideStepsProduct = (t) => {
    //const t = useTranslations('ProductsPage.tourGuide');

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
            target: '.add-product',
            content: t('step4'),
            //disableBeacon: true,
        },
        {
            target: '.import-products',
            content: t('step5'),
        },
        {
            target: '.export-products',
            content: t('step6-1')+'\n' +
                t('step6-2'),
        },
    ];
};

export const tourGuideStepsProductNoDocs = (t) => {
    const steps = tourGuideStepsProduct(t).slice(1) as TourGuideStepType[];
    steps[0].disableBeacon = true;
    return steps;
}