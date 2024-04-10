export const StockMovementsHints = (docType: string) => ({
    number: '',
    incomingNumber: `${docType} number in your system (or just convenient for you)`,
    estimatedTimeArrives: `Estimated time of arrival`,
    status: ``,
    statusAdditionalInfo: ``,
    sender: `Fill in street, building number, zip code, company name, contact person name, contact phone number`,
    senderCountry: ``,
    receiver: `Fill in street, building number, zip code, company name, contact person name, contact phone number`,
    receiverCountry: ``,
    courierServiceTrackingNumber: `Tracking number of your shipment`,
    comment: `Important details for us to know regarding your ${docType.toLowerCase()}`,

    // products
    importProducts: 'Here you can import products from Excel file',
    selection: `Here you can choose multiple products for the ${docType.toLowerCase()}`,
    addProduct: `Add a product to the ${docType.toLowerCase()} one by one`,
    removeSelected: 'Delete chosen products',

    files: 'Put here the following files: packing list/shipment labels/CRMs/photos and other documents',
});
