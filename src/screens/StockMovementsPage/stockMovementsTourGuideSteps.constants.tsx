
export const tourGuideStepsStockMovements = (docType: string)  => [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: `Click here to sort your ${docType}s by clicking the name of the column`,
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: `Click here to filter ${docType}s by parameters`,
        disableBeacon: true,
    },
    {
        target: '.date-input-field',
        content: `Click here to filter your ${docType}s by the period of time`,
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
    },
    {
        target: '.add-doc',
        content: `Click here to add a new  ${docType}. It will then be checked by our logistics team`,
        //disableBeacon: true,
    },
    {
        target: '.export-docs',
        content: 'Click here to export '+docType+'s into Excel \n'+
            'Note: All filters will be applied into export file',
    },
];

export const tourGuideStepsStockMovementsNoDocs = (docType: string)  => tourGuideStepsStockMovements(docType).slice(1);

