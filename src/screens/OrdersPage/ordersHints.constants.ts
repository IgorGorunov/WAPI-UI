export const OrderHints = {
    date: 'When the order was created',
    preferredDeliveryDate: 'When the order should be delivered',
    clientOrderID: 'Order number in your system',
    preferredWarehouse: 'The warehouse from which the parcel should be sent',
    preferredWarehouseMandatory: 'Switch on if this warehouse should be chosen in any case. If not mandatory and there is no stock at chosen warehouse, the system will choose another warehouse where the stock is enough',
    preferredCourierService: 'The courier service by which the parcel should be sent',
    preferredCourierServiceMandatory: 'Switch on if this courier service should be chosen in any case. If not mandatory, the system will choose a courier service according to the internal algorithm',

    //order products
    codCurrency: 'The currency in which the customer will pay the amount of the cash on delivery',
    priceCurrency: 'The currency of initial order',
    selection: 'Click here to choose multiple products for the order',
    addProduct: 'Add a product to the order one by one',
    removeSelected: 'Delete a chosen product',

    files: 'Any files related to the order (e.g., invoice or return form)',
}
