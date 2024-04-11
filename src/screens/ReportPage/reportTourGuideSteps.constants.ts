import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsReports: TourGuideStepType[] = [
    {
        target: '.filter',
        content: 'Click here to filter report by parameters',
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: 'Click here to filter report data by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
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

export const tourGuideStepsReportsWithoutVariants: TourGuideStepType[] = [...tourGuideStepsReports.slice(0,3), tourGuideStepsReports[4]];