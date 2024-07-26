
export const tourGuideStepsStockMovements = (t: any, docType: string)  => [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: t('step1-'+docType),
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: t('step2-'+docType),//`Click here to filter ${docType}s by parameters`,
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: t('step3-'+docType), //`Click here to filter ${docType}s by the period of time`,
    },
    {
        target: '.search-block',
        content: t('step4'),
    },
    {
        target: '.add-doc',
        content: t('step5-'+docType), //`Click here to add a new ${docType}. It will then be checked by our logistics team`,
        //disableBeacon: true,
    },
    {
        target: '.export-docs',
        content: t('step6-1') + ' \n' +
            t('step6-2'),
    },
];

export const tourGuideStepsStockMovementsNoDocs = (t: any, docType: string)  => {
    const steps = tourGuideStepsStockMovements(t,docType).slice(1);
    steps[0].disableBeacon = true;
    return steps;
}

