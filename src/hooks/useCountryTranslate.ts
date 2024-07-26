import {useTranslations} from "next-intl";
import {countryCodesArray, CountryCodeType} from "@/types/countries";


export const useCountryTranslate = () => {

    const t = useTranslations('countries');

    const getCountryName = (countryCode: CountryCodeType) => {
        return t(countryCode);
    }

    const getCountryOptions = () => {
        countryCodesArray.map((countryCode) => ({value: countryCode, label: t(countryCode)}));
    }

    return {getCountryName, getCountryOptions};
}
