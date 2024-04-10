
export const tourGuideStepsStockMovements = (docType: string)  => [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: `Here you can sort your ${docType}s by clicking the name of the chosen column`,
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: `Here you can filter ${docType}s by parameters`,
    },
    {
        target: '.date-input-field',
        content: `Here you can filter your ${docType}s by the period of time`,
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-doc',
        content: `Here you can create a new ${docType}. It will then be checked by our logistics team`,
        //disableBeacon: true,
    },
    {
        target: '.export-docs',
        content: `Here you can export ${docType}s into Excel
            Note: All filters will be applied into export file`,
    },
];

export const tourGuideStepsStockMovementsNoDocs = (docType: string)  => [
    {
        target: '.filter',
        content: `Here you can filter ${docType}s by parameters`,
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: `Here you can filter your ${docType}s by the period of time`,
    },
    {
        target: '.search-block',
        content: 'Write data here to locate information on the list below',
    },
    {
        target: '.add-doc',
        content: `Here you can create a new ${docType}. It will then be checked by our logistics team`,
        //disableBeacon: true,
    },
    {
        target: '.export-docs',
        content: `Here you can export ${docType}s into Excel
            Note: All filters will be applied into export file`,
    },
];

