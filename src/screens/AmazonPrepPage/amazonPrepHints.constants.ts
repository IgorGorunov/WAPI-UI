export const AmazonPrepHints = {
    date: 'When the order was created',
    preferredDeliveryDate: 'When the order should be delivered to the customer',
    clientOrderID: 'Order number in your system',
    comment: 'Some instruction to warehouse',
    asnNumber: 'Amazon Shipment Notification Number',
    deliveryMethod: 'Type of Amazon Prep Order: LTL (Less than Truckload) or SPD (Small Parcel Delivery)',
    carrierType: 'Under what contract should the order go',
    warehouse: 'The warehouse from which the order will be sent',
    courierService: 'The courier service by which the parcel should be sent',
    courierServiceTrackingNumber: 'Tracking number of your parcel',
    trackingLink: 'Here will be a tracking link when the parcel will be dispatched',
    multipleLocations: 'Switch on if the order should go to multiple locations, then do not specify the address',

    //products
    products: 'Specify information on your products here',
    boxTypes: 'When the quantity of boxes is known in advance | When the quantity of boxes is unknown in advance',
    prepackedMasterBoxes: 'When the quantity of boxes is known in advance',
    buildNewBoxes: 'When the quantity of boxes is unknown in advance',
    selection: 'Here you can choose multiple products for the order',
    addProduct: 'Add a product to the order one by one',
    removeSelected: 'Delete a chosen product',

    files: 'You can attach files here by drag and drop or Ctrl+V',
}
