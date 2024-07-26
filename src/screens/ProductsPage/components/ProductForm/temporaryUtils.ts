// import {SingleProductType} from "@/types/products";
// import {
//     FormFieldsGeneral,
//     FormFieldsSKU,
//     FormFieldsWarehouse
// } from "@/screens/ProductsPage/components/ProductForm/ProductFormFields";
//
// export const validateProduct = (productData: SingleProductType) => {
//     const errors: string[] = [];
//     let isValid = true;
//
//     const generalFields = FormFieldsGeneral({countries:[], isNew:false});
//     generalFields.forEach(property => {
//         if ((property.rules?.required && !productData[property.name])) {
//             isValid = false;
//             errors.push(`${property.label} is not filled`);
//         }
//     })
//
//     const formSkus = FormFieldsSKU();
//     formSkus.forEach(property => {
//         if ((property.rules?.required && !productData[property.name])) {
//             isValid = false;
//             errors.push(`${property.label} is not filled`);
//         }
//     })
//
//     const formFieldsWarehouse = FormFieldsWarehouse({typeOfStorage: [], salesPackingMaterial: [], specialDeliveryOrStorageRequirements:[]})
//     formFieldsWarehouse.forEach(property => {
//         if ((property.rules && property.rules.required && !productData[property.name])) {
//             isValid = false;
//             errors.push(`${property.label} is not filled`);
//         }
//     })
//
//     if (!productData.unitOfMeasure) {
//         isValid = false;
//         errors.push(`Unit of measure is not filled`);
//     }
//
//     return {isValid, errors}
// }