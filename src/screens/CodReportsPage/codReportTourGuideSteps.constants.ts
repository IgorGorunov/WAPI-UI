import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsCodReports = (t) => {
    return [
        {
            target: '.indicator-info-card.year', //'.product-list__container',
            content: t('step1'),
            disableBeacon: true,
        },
        {
            target: '.indicator-info-card.month',
            content: t('step2'),
        },
        {
            target: '.indicator-info-card.current',
            content: t('step3'),
        },
        {
            target: '.date-input-field',
            content: t('step4'),
        },
        {
            target: '.search-block',
            content: t('step5'),
        },
        {
            target: '.export-file',
            content: t('step6-1') + ' \n' +
                t('step6-2'),
        },
    ] as TourGuideStepType[];
}

export const tourGuideStepsCodReportsNoDocs = (t) => tourGuideStepsCodReports(t);