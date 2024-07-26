import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsInvoices = (t) => {
    return [
        {
            target: '.balance-info-card.debt',
            content: t('step1'),
            disableBeacon: true,
        },
        {
            target: '.balance-info-card.overdue',
            content: t('step2'),
        },
        {
            target: '.balance-info-card.limit',
            content: t('step3'),
        },
        {
            target: '.filter',
            content: t('step4'),
        },
        {
            target: '.date-input-field',
            content: t('step5'),
        },
        {
            target: '.search-block',
            content: t('step6'),
        },
        {
            target: '.export-invoices',
            content: t('step7-1')+'  \n' +
                t('step7-2'),
        },
    ] as TourGuideStepType[];
}

export const tourGuideStepsInvoicesNoBalance = (t) => {
    const steps = tourGuideStepsInvoices(t);
    steps.shift();
    steps.shift();
    steps.shift();
    steps[0].disableBeacon = true;
    return steps;
}