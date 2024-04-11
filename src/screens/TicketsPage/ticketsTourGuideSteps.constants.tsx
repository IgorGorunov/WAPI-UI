
export const tourGuideStepsTickets  = [
    {
        target: '.ant-table-header', //'.product-list__container',
        content: 'Here you can sort your tickets by clicking the name of the chosen column',
        disableBeacon: true,
    },
    {
        target: '.filter',
        content: 'Click here to filter tickets by parameters',
    },
    {
        target: '.date-input-field',
        content: 'Click here to filter your tickets by the period of time',
    },
    {
        target: '.search-block',
        content: 'Write data here to find information on the list below',
    },
    {
        target: '.add-ticket',
        content: 'Click here to add a new ticket to support manager. Please note that if your question is related to specific order/product/movement, create a ticket from the corresponding document',
        //disableBeacon: true,
    },

];

export const tourGuideStepsTicketsNoDocs  = tourGuideStepsTickets.slice(1);
tourGuideStepsTicketsNoDocs[0].disableBeacon = true;
