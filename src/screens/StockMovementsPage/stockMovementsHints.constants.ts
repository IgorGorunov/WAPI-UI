export const StockMovementsHints = (docType = '') => {
    return {
    number: '',
    incomingNumber: `${docType} number in your system (or just convenient for you)`,
    estimatedTimeArrives: `Estimated time of arrival`,
    status: ``,
    statusAdditionalInfo: ``,
    sender: (docType=='Inbound' || docType=='Logistic service') ? `Fill in street, building number, zip code, company name, contact person name, contact phone number` : 'Select sender warehouse',
    senderCountry: ``,
    receiver: (docType=='Outbound' || docType=='Logistic service') ? `Fill in street, building number, zip code, company name, contact person name, contact phone number` : 'Select receiver warehouse',
    receiverCountry: ``,
    courierServiceTrackingNumber: `Tracking number of your shipment`,
    comment: `Important details for us to know regarding your ${docType.toLowerCase()}`,
    deliveryMethod: '',
    transportationType: ``,
    labelingNeeds: ``,
    mixedCarton: `Multiple SKUs combined in one pallet or carton`,
    container20Amount: ``,
    container40Amount: ``,

    // products
    importProducts: 'Click here to import products from Excel file',
    selection: `Click here to choose multiple products for the  ${docType.toLowerCase()}`,
    // addProduct: `Add a product to the ${docType.toLowerCase()} one by one`,
    // removeSelected: 'Delete chosen products',

    files: 'Put here the following files: packing list/shipment labels/CRMs/photos and other documents',
}};
