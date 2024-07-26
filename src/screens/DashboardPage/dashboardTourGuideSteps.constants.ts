import {useTranslations} from "next-intl";

export const dashboardSteps = () => {
    const t = useTranslations('Dashboard.tourGuide');

    return [
        {
            target: '.profile-dropdown__user',
            content: t('step1'),
            disableBeacon: true,
        },
        {
            target: '.tour-guide',
            content: t('step2'),
        },
        {
            target: '.header-notifications__wrapper',
            content: t('step3'),
        },
        {
            target: '.main-header__icon',
            content: t('step4'),
        },
        {
            target: '.period-filter',
            content: t('step5'),
        },
        {
            target: '.forecast__container.gmv',
            content: t('step6')
        },
        {
            target: '.order-statuses',
            content: t('step7'),
        },
        {
            target: '.forecast.orders',
            content: t('step8'),
        },
        {
            target: '.dashboard-diagram__wrapper',
            content: t('step9'),
        },
        {
            target: '.orders-by-country',
            content: t('step10'),
        },
        {
            target: '.orders-by-country-of-arrival',
            content: t('step11'),
        },
    ];
}