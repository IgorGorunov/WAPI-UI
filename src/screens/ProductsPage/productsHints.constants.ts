export const ProductHints = {
    name: 'Short product name. Max length is 75 characters',
    countryOfOrigin: 'Where product was produced',
    purchaseValue: 'Purchase cost',
    fullName: 'Full name of the product. Max length is 250 characters',
    status: "Product's status",
    sku: 'Stock Keeping Unit (Unique code of the product). Max length is 25 characters',
    amazonSku: 'SKU for Amazon',
    hsCode: 'Short for Harmonized Commodity Description and Coding System',
    typeOfStorage: 'Where to keep your products',
    salesPackingMaterial: 'Packaging of the product - how it looks now',
    specialDeliveryStorageRequest: "Standard packaging is a postal package", //'Wishes on packaging, if any',
    whoProvidesPackagingMaterial: 'Required if "Special delivery / storage request" field is specified',
    specialTemperatureControl: 'Temperature conditions',
    expiringTerm: 'Expiration date of the product',
    packingBox: 'If the product is packing box, e.g. box/plastic bag',
    additionalService: 'If the product is virtual (like insurance, electronic gift card etc.)',
}
export const ProductDimensionsHints = {
    name: 'Unit of goods name',
    unitOfMeasure: 'What is the default unit of the product', //default unit
    // 'add-unit-btn': 'Add unit',
    // 'remove-unit-btn': 'Delete a chosen unit',
}

export const ProductOtherHints = {
    aliases: 'Alternative names of the product',
    virtualBundleKit: 'If the product is a set and should be break down into several products, specify the products and quantities here',
    analogues: 'If the product is out of stock, the system will take its analogue (specify it here)',
    files: 'Any files related to the product (e.g., pictures or certificates). The supported file formats: PNG, JPEG, PDF',

    // 'add-barcode-btn': 'Add barcode',
    // 'remove-barcode-btn': 'Delete a chosen barcode',
    // 'add-alias-btn': 'Add alias',
    // 'remove-alias-btn': 'Delete a chosen alias',
    // 'add-bundle-btn': 'Add product to bundle',
    // 'remove-bundle-btn': 'Delete a chosen product',
    // 'add-analogue-btn': 'Add analogue',
    // 'remove-analogue-btn': 'Delete a chosen product',
}