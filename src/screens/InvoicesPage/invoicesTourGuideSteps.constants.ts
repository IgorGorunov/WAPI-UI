import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsInvoices: TourGuideStepType[] = [
    {
        target: '.balance-info-card.debt', //'.product-list__container',
        content: 'Current total debt',
        disableBeacon: true,
    },
    {
        target: '.balance-info-card.overdue',
        content: 'Current overdue debt',
    },
    {
        target: '.balance-info-card.limit',
        content: 'Overdue debt limit',
    },
    {
        target: '.filter',
        content: 'Click here to filter invoices by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Click here to filter your invoices by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
    },
    {
        target: '.export-invoices',
        content: 'Click here to export invoices into Excel  \n' +
            'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsInvoicesNoDocs: TourGuideStepType[] = tourGuideStepsInvoices;