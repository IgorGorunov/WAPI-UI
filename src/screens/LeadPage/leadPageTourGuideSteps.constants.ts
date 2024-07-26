import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsLeads = (t) => [
    {
        target: '.tabs-block__tab-link.prices-tab',
        content: t('step1'),
        disableBeacon: true,
    },
    {
        target: '.tabs-block__tab-link.legal-documentation-tab',
        content: t('step2'),
    },
    {
        target: '.tabs-block__tab-link.api-info-tab',
        content: t('step3'),
    },
    // {
    //     target: '.tabs-block__tab-link.ui-tutorial-tab',
    //     content: t('step4'),
    // },

] as TourGuideStepType[];
