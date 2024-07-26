import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsTickets  = (t) => [
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
        target: '.date-input-field',
        content: t('step3'),
    },
    {
        target: '.search-block',
        content: t('step4'),
    },
    {
        target: '.add-ticket',
        content: t('step5'),
        //disableBeacon: true,
    },

] as TourGuideStepType[];

export const tourGuideStepsTicketsNoDocs  = (t) => {
    const steps = tourGuideStepsTickets(t).slice(1);
    steps[0].disableBeacon = true;
    return steps;
}
