export const ProductHints = {
    name: 'Short product name',
    countryOfOrigin: 'Country, where product has been produced',
    purchaseValue: 'Purchase cost',
    fullName: 'Full name of the product',
    status: "Product's status",
    sku: 'Stock Keeping Unit (Unique code of the product)',
    amazonSku: 'SKU for Amazon',
    hsCode: 'Short for Harmonized Commodity Description and Coding System',
    typeOfStorage: 'Where to keep your products',
    salesPackingMaterial: 'Packaging of the product - how it looks now',
    specialDeliveryStorageRequest: 'Wishes on packaging, if any',
    whoProvidesPackagingMaterial: 'Required if "Special delivery / storage request" field is specified',
    specialTemperatureControl: 'Temperature conditions',
    expiringTerm: 'Expiration date of the product',
    packingBox: 'If the product is packing box',
}
export const ProductDimensionsHints = {
    name: 'Unit of goods name',
    unitOfMeasure: 'What is the default unit of the product', //default unit
}

export const ProductOtherHints = {
    aliases: 'Alternative names of the product',
    virtualBundleKit: 'If the product is a set and should be break down into several products, specify the products and quantities here',
    analogues: 'If the product is out of stock, the system will take its analogue (specify it here)',
    files: 'Any files related to the product (for example, pictures or certificates)',
}