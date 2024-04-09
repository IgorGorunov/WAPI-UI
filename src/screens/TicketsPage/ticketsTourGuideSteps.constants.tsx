import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsTickets  = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your tickets by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Here you can filter tickets by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Here you can filter your tickets by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-ticket',
        content: 'Here you can create a ticket by filling out the form',
        //disableBeacon: true,
    },

];
