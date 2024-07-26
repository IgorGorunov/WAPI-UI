import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsReports = (t) => [
    {
        target: '.filter',
        content: t('step1'),
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: t('step2'),
    },
    {
        target: '.search-block',
        content: t('step3'),
    },
    {
        target: '.variant-container__wrapper',
        content: t('step4'),
    },
    {
        target: '.generate-report-btn',
        content: t('step5'),
    },
] as TourGuideStepType[];

export const tourGuideStepsReportsWithoutVariants = (t) => [...tourGuideStepsReports(t).slice(0,3), tourGuideStepsReports[4]];