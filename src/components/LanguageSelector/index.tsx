import React from 'react';
import './styles.scss';
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {MessageKeys, useTranslations} from "next-intl";
import {useRouter} from "next/router";
import Cookie from "js-cookie";

const flagIcons = {
    "en": "gb",
    "uk": "ua"
}

const getCountryCode = (langCode: string) => {
    return flagIcons[langCode] || langCode;
}

const LanguageSelector = () => {

    // const { i18n } = useTranslation();
    //
    // const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({label: lang, value: lang}));
    //
    // const handleLanguageChange = (lng: string) => {
    //     // console.log('lng: ', lng)
    //     // i18n.changeLanguage(lng);
    // };

    const t = useTranslations('LocaleSelector');

    const router = useRouter();
    const {locale, locales } = router;

    const languageOptions = locales.map((lang) => ( {
            label: (
                <div className={`language-selector-dropdown-option`}>
                    <span className={`fi fi-${getCountryCode(lang)} flag-icon lang-icon`} />
                    {t(lang as MessageKeys<string, any>)}
                </div>
            ),
            value: lang
        }
    ));

    const handleLanguageChange = async(lng: string) => {
        Cookie.set('NEXT_LOCALE', lng);

        await router.push({
            pathname: router.pathname,
            query: router.query
        }, router.asPath, {locale: lng});
    }

    return (
        <div className="language-selector">
            <div className="language-selector-wrapper">
                <div className="language-selector-dropdown">
                    <FieldBuilder
                        name='language-selector'
                        fieldType={FormFieldTypes.SELECT}
                        label=''
                        options={languageOptions}
                        value={locale}
                        onChange={handleLanguageChange}
                        isSearchable={false}
                        isClearable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;