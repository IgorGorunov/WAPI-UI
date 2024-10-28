import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsLeads: TourGuideStepType[] = [
    {
        target: '.tabs-block__tab-link.company-tab',
        content: 'Watch an introduction about Wapi and Wapi system\n',
        disableBeacon: true,
    },
    {
        target: '.tabs-block__tab-link.prices-tab',
        content: 'Explore our pricing here - you can see basic price lists',
    },
    {
        target: '.tabs-block__tab-link.legal-documentation-tab',
        content: 'Read a contract sample, fill in your contract details and click “Submit contract”',
    },
    {
        target: '.tabs-block__tab-link.integration-tab',
        content: 'Check the ways to integrate with WAPI',
    },

    // {
    //     target: '.tabs-block__tab-link.ui-tutorial-tab',
    //     content: 'Refer to the UI tutorial for assistance',
    // },

];
