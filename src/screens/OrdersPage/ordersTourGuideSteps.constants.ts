import {TourGuideStepType} from "@/types/tourGuide";

export const tourGuideStepsOrders = (t: any) =>{
    return [
        {
            target: '.ant-table-header', //'.product-list__container',
            content: t("step1"),
            disableBeacon: true,
        },
        {
            target: '.filter',
            content: t("step2"),
        },
        {
            target: '.date-input-field',
            content: t("step3"),
        },
        {
            target: '.search-block',
            content: t("step4"),
        },
        {
            target: '.add-order',
            content: t("step5"),
            //disableBeacon: true,
        },
        {
            target: '.import-orders',
            content: t("step6"),
        },
        {
            target: '.export-orders',
            content: t("step7-1")+'  \n' +
                t("step7-2"),
        },
    ] as TourGuideStepType[];
}

export const tourGuideStepsOrdersNoDocs  = (t: any) => {
    const steps = tourGuideStepsOrders(t).slice(1);
    steps[0].disableBeacon = true;
    return steps;
}
