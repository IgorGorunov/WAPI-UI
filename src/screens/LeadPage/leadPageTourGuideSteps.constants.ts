import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsLeads: TourGuideStepType[] = [
    {
        target: '.tabs-block__tab-link.prices',
        content: 'Explore our pricing here - you can see basic price lists',
        disableBeacon: true,
    },
    {
        target: '.tabs-block__tab-link.legal-documentation',
        content: 'Read a contract sample, fill in your contract details and click “Submit contract”',
    },
    {
        target: '.tabs-block__tab-link.api-info',
        content: 'Find our API documentation and other ways to integrate with WAPI',
    },
    // {
    //     target: '.tabs-block__tab-link.ui-tutorial',
    //     content: 'Refer to the UI tutorial for assistance',
    // },

];
