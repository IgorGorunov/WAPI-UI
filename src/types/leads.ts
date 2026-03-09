
import type { E164Number } from "libphonenumber-js";
import type { AttachedFilesType } from "@/types/utility";

export const enum UserStatusType {
    'user' = 'user',
    'Questionnaire' = 'Questionnaire',
    'Waiting' = 'Waiting',
    'LegalNoPrices' = 'LegalNoPrices',
    'LegalPrices' = 'LegalPrices',
    'NoLegalNoPrices' = 'NoLegalNoPrices',
    'NoLegalPrices' = 'NoLegalPrices',
    'Rejected' = 'Rejected',
}

export type QuestionnaireParamsType = {
    marketplaces: string[];
    targetCountries: string[];
    productTypes: string[];
}

export type QuestionnaireFormType = {
    companyName: string;
    companyWebpage: string;
    productTypes: string[];
    marketplaces: string[];
    salesVolumePerMonth: number;
    targetCountries: string[];
    skus: number;
    dimensionsOfLargestProduct: string;
    weightOfHeaviestProduct: number;
    additionalPackagingForLastMileDelivery: boolean;
    needsCOD: boolean;
    vatNo: string;
    companyWorksWithoutVAT: boolean;
    productTypeDescriptions: ProductTypeDescriptionType[];
}

export type ProductTypeDescriptionType = {
    productTypeName: string;
    productLink: string;
    productPhoto: AttachedFilesType[],
    hazmat: boolean;
    hasSerialNumbers: boolean;
    batches: boolean;
    cbdProduct: boolean;
    food: boolean;
    alcohol: boolean;
    cigarettes: boolean;
    fragile: boolean;
    glass: boolean;
    flammable: boolean;
    liquid: boolean;
};

export type LegalInfoFormType = {
    companyName: string;
    registrationCountry: string;
    regNo: string;
    legalAddress: string;
    vatNo: string;
    bank: string;
    accountNo: string;
    bankAddress: string;
    swiftCode: string;
    representedBy: string;
    actingOnTheBasisOf: string;
    phoneNumber: E164Number;
    contractEmail: string;
}

export type PriceInfoType = {
    country: string;
    name: string;
    uuid: string;
}