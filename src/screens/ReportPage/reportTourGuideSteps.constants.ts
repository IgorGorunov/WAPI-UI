import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsReports: TourGuideStepType[] = [
    {
        target: '.filter',
        content: 'Here you can filter report by parameters',
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: 'Here you can filter your report data by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.variant-container__wrapper',
        content: 'Choose grouping',
    },
    {
        target: '.generate-report-btn',
        content: 'Click here to generate a report',
    },
]

export const tourGuideStepsReportsWithoutVariants: TourGuideStepType[] = [
    {
        target: '.filter',
        content: 'Here you can filter report by parameters',
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: 'Here you can filter your report data by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.generate-report-btn',
        content: 'Click here to generate a report',
    },
]