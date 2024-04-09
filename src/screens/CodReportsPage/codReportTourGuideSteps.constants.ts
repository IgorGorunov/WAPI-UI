import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsCodReports: TourGuideStepType[] = [
    {
        target: '.indicator-info-card.year', //'.product-list__container',
        content: 'COD accrued from the beginning of the year to the date',
        disableBeacon: true,
    },
    {
        target: '.indicator-info-card.month',
        content: 'COD accrued from the beginning of the month to the date',
    },
    {
        target: '.indicator-info-card.current',
        content: 'COD accrued in the current period',
    },
    {
        target: '.date-input-field',
        content: 'Here you can filter your COD reports by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.export-file',
        content: 'Here you can export COD reports into Excel \n' +
            'Note: All filters will be applied into export file',
    },
]