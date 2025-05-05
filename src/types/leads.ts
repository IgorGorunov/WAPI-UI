
import {E164Number} from "libphonenumber-js";

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
}

export type LegalInfoFormType = {
    companyName : string;
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