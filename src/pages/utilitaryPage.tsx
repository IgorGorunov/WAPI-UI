import Head from "next/head";
import {GetStaticPropsContext} from "next";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import convertJsonToXlsx from "@/utils/exportToXLS";

export default function SignUp() {
    const t = useTranslations('countries');

    useEffect(() => {
        const res = {};
        const res2 = {};
        c.forEach(item => res[item.value] = item.label)
        c.forEach((item, index) => res2[item.value] = translations[index] || item.label)
    }, [c, translations]);

    const jsonData = {
        "CookiePolicy": {
            "headerTitle": "Cookie policy",
            "text1-1": "This Cookie Policy explains how we use cookies and similar tracking technologies when you visit our website ",
            "text1-link": "https://ui.wapi.com",
            "text1-2": ". By continuing to browse the site, you are agreeing to our use of cookies as outlined in this policy.",
            "text2": "What are cookies?",
            "text3": "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.",
            "text4": "How do we use cookies? ",
            "text5": "We use cookies for the following purposes: ",
            "list": {
                "item1-title": "Essential Cookies: ",
                "item1-text": "These cookies are necessary for the website to function properly. They enable you to navigate the website and use its features.",
                "item2-title": "Functionality Cookies: ",
                "item2-text": "These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name, and remember your preferences (for example, your choice of language or region).",
                "item3-title": "Performance Cookies: ",
                "item3-text": "These cookies collect information about how visitors use our website, such as which pages are visited most often. This information is aggregated and anonymous, and is used to improve the functionality of the website. We use Microsoft Clarity to help us understand how our users interact with our website."
            },
            "text6": "List of cookies we use:",
            "tableColumns": {
                "name": "Name",
                "type": "Type",
                "description": "Description",
                "duration": "Duration"
            },
            "essential": "Essential",
            "performance": "Performance",
            "storesConsent":"Stores user's cookie consent.",
            "6Month": "6 month",
            "session": "Session",
            "1Day": "1 day",
            "1Tear": "1 year",
            "identifyUser": "Used to identify the user once logged in.",
            "identifyUserStatus": "Used to identify logged user status.",
            "usersName": "Stores user's name to display in UI.",
            "currentDate": "Stores current date.",
            "uiTutorials": "Stores information about UI tutorials user watched to not display these tutorials again.",
            "profileInfo": "Stores logged user's profile info.",
            "navAccess": "Stores logged user's navigation access info.",
            "clickClarity": "Used by Microsoft Clarity. Persists the Clarity User ID and preferences, unique to that site, on the browser. This ensures that behavior in subsequent visits to the same site will be attributed to the same user ID.",
            "slskClarity": "Used by Microsoft Clarity. Connects multiple page views by a user into a single Clarity session recording.",
            "text7": "Updates to this Cookie Policy",
            "text8": "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies. ",
            "text9": "By using our website, you consent to the use of cookies as described in this Cookie Policy."
        },

        "cookieConsent": {
            "text1": "We use cookies to enhance your experience on our site. Review our cookie policy",
            "text2": "here",
            "okBtn": "OK"
        },
    }

    const handleDownload = () => {
        console.log(convertJsonToXlsx(jsonData));
    }


    return (
        <>
            <Head>
                <title>Sign up</title>
                <meta name="login" content="login" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div>
                {/*{c.map(item => `"${item.label}", `)}*/}

                <button onClick={handleDownload}>Download XLSX</button>
            </div>
            <br/>
            <div>{c.length}</div>
        </>
    );
}

export async function getStaticProps({locale}: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../messages/${locale}.json`)).default
        }
    };
}

const translations = ["Afganistán", "AlandIslands", "Albania", "Argelia", "Samoa Americana", "Andorra", "Angola", "Anguila", "Antártida", "Antigua y Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bahrein", "Bangladesh", "Barbados", "Belarús", "Bélgica", "Belice", "Benín", "Bermudas", "Bután", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Isla Bouvet", "Brasil", "Territorio Británico del Océano Índico", "Brunéi Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Camboya", "Camerún", "Canadá", "Cabo Verde", "Islas Caimán", "República Centroafricana", "Chad", "Chile", "China", "Isla Christmas", "Islas Cocos Keeling", "Colombia", "Comoras", "Congo", "República Democrática del Congo", "Islas Cook", "Costa Rica", "Costa de Marfil", "Croacia", "Cuba", "Curaçao", "Chipre", "República Checa", "Dinamarca", "Yibuti", "Dominica", "República Dominicana", "Ecuador", "Egipto", "El Salvador", "Guinea Ecuatorial", "Eritrea", "Estonia", "Etiopía", "Islas Malvinas", "Islas Feroe", "Fiyi", "Finlandia", "Francia", "Guayana Francesa", "Polinesia Francesa", "Territorios Australes Franceses", "Gabón", "Gambia", "Georgia", "Alemania", "Ghana", "Gibraltar", "Grecia", "Groenlandia", "Granada", "Guadalupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haití", "Islas Heard Island Mcdonald", "Santa Sede, Estado de la Ciudad del Vaticano", "Honduras", "HongKong", "Hungría", "Islandia", "India", "Indonesia", "Irán", "Irak", "Irlanda", "Isla de Man", "Israel", "Italia", "Jamaica", "Japón", "Jersey", "Jordania", "Kazajstán", "Kenia", "Kiribati", "Corea, República de", "Corea, República Popular Democrática de", "Kuwait", "Kirguistán", "República Democrática Popular Lao", "Letonia", "Líbano", "Lesoto", "Liberia", "Jamahiriya Árabe Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Macao", "Madagascar", "Malawi", "Malasia", "Maldivas", "Malí", "Malta", "Islas Marshall", "Martinica", "Mauritania", "Mauricio", "Mayotte", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Montserrat", "Marruecos", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Países Bajos", "Nueva Caledonia", "Nueva Zelanda", "Nicaragua", "Níger", "Nigeria", "Niue", "Isla Norfolk", "Islas Marianas del Norte", "Noruega", "Omán", "Pakistán", "Palaos", "Territorio Palestino", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Filipinas", "Pitcairn", "Polonia", "Portugal", "Puerto Rico", "Qatar", "Reunión", "República de Macedonia del Norte", "Rumanía", "Federación de Rusia", "Ruanda", "San Bartolomé", "Santa Elena", "San Cristóbal y Nieves", "Santa Lucía", "San Martín", "San Pedro y Miquelón", "San Vicente y las Granadinas", "Samoa", "San Marino", "Santo Tomé y Príncipe", "Arabia Saudí", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Eslovaquia", "Eslovenia", "Islas Salomón", "Somalia", "Sudáfrica", "Georgia del Sur y Sandwich del Sur", "España", "Sri Lanka", "Sudán", "Sudán del Sur", "Surinam", "Svalbard y Jan Mayen", "Suazilandia", "Suecia", "Suiza", "San Martín (parte neerlandesa", "República Árabe Siria", "Taiwán", "Tayikistán", "Tanzania", "Tailandia", "Timor Oriental", "Togo", "Tokelau", "Tonga", "Trinidad y Tobago", "Túnez", "Turquía", "Turkmenistán", "Islas Turcas y Caicos", "Tuvalu", "Uganda", "Ucrania", "Emiratos Árabes Unidos", "Reino Unido", "United States", "United States Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands British", "Virgin Islands US", "Wallis And Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];

const c = [
    {label: "Afghanistan", value: "af"},
    {label: "AlandIslands", value: "ax"},
    {label: "Albania", value: "al"},
    {label: "Algeria", value: "dz"},
    {label: "American Samoa", value: "as"},
    {label: "Andorra", value: "ad"},
    {label: "Angola", value: "ao"},
    {label: "Anguilla", value: "ai"},
    {label: "Antarctica", value: "aq"},
    {label: "Antigua and Barbuda", value: "ag"},
    {label: "Argentina", value: "ar"},
    {label: "Armenia", value: "am"},
    {label: "Aruba", value: "aw"},
    {label: "Australia", value: "au"},
    {label: "Austria", value: "at"},
    {label: "Azerbaijan", value: "az"},
    {label: "Bahamas", value: "bs"},
    {label: "Bahrain", value: "bh"},
    {label: "Bangladesh", value: "bd"},
    {label: "Barbados", value: "bb"},
    {label: "Belarus", value: "by"},
    {label: "Belgium", value: "be"},
    {label: "Belize", value: "bz"},
    {label: "Benin", value: "bj"},
    {label: "Bermuda", value: "bm"},
    {label: "Bhutan", value: "bt"},
    {label: "Bolivia", value: "bo"},
    {label: "Bosnia and Herzegovina", value: "ba"},
    {label: "Botswana", value: "bw"},
    {label: "Bouvet Island", value: "bv"},
    {label: "Brazil", value: "br"},
    {label: "British Indian Ocean Territory", value: "io"},
    {label: "Brunei Darussalam", value: "bn"},
    {label: "Bulgaria", value: "bg"},
    {label: "Burkina Faso", value: "bf"},
    {label: "Burundi", value: "bi"},
    {label: "Cambodia", value: "kh"},
    {label: "Cameroon", value: "cm"},
    {label: "Canada", value: "ca"},
    {label: "Cape Verde", value: "cv"},
    {label: "Cayman Islands", value: "ky"},
    {label: "Central African Republic", value: "cf"},
    {label: "Chad", value: "td"},
    {label: "Chile", value: "cl"},
    {label: "China", value: "cn"},
    {label: "Christmas Island", value: "cx"},
    {label: "Cocos Keeling Islands", value: "cc"},
    {label: "Colombia", value: "co"},
    {label: "Comoros", value: "km"},
    {label: "Congo", value: "cg"},
    {label: "Congo Democratic Republic", value: "cd"},
    {label: "Cook Islands", value: "ck"},
    {label: "Costa Rica", value: "cr"},
    {label: "CoteDIvoire", value: "ci"},
    {label: "Croatia", value: "hr"},
    {label: "Cuba", value: "cu"},
    {label: "Curaçao", value: "cw"},
    {label: "Cyprus", value: "cy"},
    {label: "Czech Republic", value: "cz"},
    {label: "Denmark", value: "dk"},
    {label: "Djibouti", value: "dj"},
    {label: "Dominica", value: "dm"},
    {label: "Dominican Republic", value: "do"},
    {label: "Ecuador", value: "ec"},
    {label: "Egypt", value: "eg"},
    {label: "El Salvador", value: "sv"},
    {label: "Equatorial Guinea", value: "gq"},
    {label: "Eritrea", value: "er"},
    {label: "Estonia", value: "ee"},
    {label: "Ethiopia", value: "et"},
    {label: "Falkland Islands", value: "fk"},
    {label: "Faroe Islands", value: "fo"},
    {label: "Fiji", value: "fj"},
    {label: "Finland", value: "fi"},
    {label: "France", value: "fr"},
    {label: "French Guiana", value: "gf"},
    {label: "French Polynesia", value: "pf"},
    {label: "French Southern Territories", value: "tf"},
    {label: "Gabon", value: "ga"},
    {label: "Gambia", value: "gm"},
    {label: "Georgia", value: "ge"},
    {label: "Germany", value: "de"},
    {label: "Ghana", value: "gh"},
    {label: "Gibraltar", value: "gi"},
    {label: "Greece", value: "gr"},
    {label: "Greenland", value: "gl"},
    {label: "Grenada", value: "gd"},
    {label: "Guadeloupe", value: "gp"},
    {label: "Guam", value: "gu"},
    {label: "Guatemala", value: "gt"},
    {label: "Guernsey", value: "gg"},
    {label: "Guinea", value: "gn"},
    {label: "Guinea Bissau", value: "gw"},
    {label: "Guyana", value: "gy"},
    {label: "Haiti", value: "ht"},
    {label: "Heard Island Mcdonald Islands", value: "hm"},
    {label: "Holy See Vatican City State", value: "va"},
    {label: "Honduras", value: "hn"},
    {label: "HongKong", value: "hk"},
    {label: "Hungary", value: "hu"},
    {label: "Iceland", value: "is"},
    {label: "India", value: "in"},
    {label: "Indonesia", value: "id"},
    {label: "Iran", value: "ir"},
    {label: "Iraq", value: "iq"},
    {label: "Ireland", value: "ie"},
    {label: "Isle Of Man", value: "im"},
    {label: "Israel", value: "il"},
    {label: "Italy", value: "it"},
    {label: "Jamaica", value: "jm"},
    {label: "Japan", value: "jp"},
    {label: "Jersey", value: "je"},
    {label: "Jordan", value: "jo"},
    {label: "Kazakhstan", value: "kz"},
    {label: "Kenya", value: "ke"},
    {label: "Kiribati", value: "ki"},
    {label: "Korea, Republic of", value: "kr"},
    {label: "Korea, Democratic People's Republic of", value: "kp"},
    {label: "Kuwait", value: "kw"},
    {label: "Kyrgyzstan", value: "kg"},
    {label: "Lao Peoples Democratic Republic", value: "la"},
    {label: "Latvia", value: "lv"},
    {label: "Lebanon", value: "lb"},
    {label: "Lesotho", value: "ls"},
    {label: "Liberia", value: "lr"},
    {label: "Libyan Arab Jamahiriya", value: "ly"},
    {label: "Liechtenstein", value: "li"},
    {label: "Lithuania", value: "lt"},
    {label: "Luxembourg", value: "lu"},
    {label: "Macao", value: "mo"},
    {label: "Madagascar", value: "mg"},
    {label: "Malawi", value: "mw"},
    {label: "Malaysia", value: "my"},
    {label: "Maldives", value: "mv"},
    {label: "Mali", value: "ml"},
    {label: "Malta", value: "mt"},
    {label: "Marshall Islands", value: "mh"},
    {label: "Martinique", value: "mq"},
    {label: "Mauritania", value: "mr"},
    {label: "Mauritius", value: "mu"},
    {label: "Mayotte", value: "yt"},
    {label: "Mexico", value: "mx"},
    {label: "Micronesia", value: "fm"},
    {label: "Moldova", value: "md"},
    {label: "Monaco", value: "mc"},
    {label: "Mongolia", value: "mn"},
    {label: "Montenegro", value: "me"},
    {label: "Montserrat", value: "ms"},
    {label: "Morocco", value: "ma"},
    {label: "Mozambique", value: "mz"},
    {label: "Myanmar", value: "mm"},
    {label: "Namibia", value: "na"},
    {label: "Nauru", value: "nr"},
    {label: "Nepal", value: "np"},
    {label: "Netherlands", value: "nl"},
    {label: "New Caledonia", value: "nc"},
    {label: "New Zealand", value: "nz"},
    {label: "Nicaragua", value: "ni"},
    {label: "Niger", value: "ne"},
    {label: "Nigeria", value: "ng"},
    {label: "Niue", value: "nu"},
    {label: "Norfolk Island", value: "nf"},
    {label: "Northern Mariana Islands", value: "mp"},
    {label: "Norway", value: "no"},
    {label: "Oman", value: "om"},
    {label: "Pakistan", value: "pk"},
    {label: "Palau", value: "pw"},
    {label: "Palestinian Territory", value: "ps"},
    {label: "Panama", value: "pa"},
    {label: "Papua New Guinea", value: "pg"},
    {label: "Paraguay", value: "py"},
    {label: "Peru", value: "pe"},
    {label: "Philippines", value: "ph"},
    {label: "Pitcairn", value: "pn"},
    {label: "Poland", value: "pl"},
    {label: "Portugal", value: "pt"},
    {label: "Puerto Rico", value: "pr"},
    {label: "Qatar", value: "qa"},
    {label: "Reunion", value: "re"},
    {label: "Republic of North Macedonia", value: "mkd"},
    {label: "Romania", value: "ro"},
    {label: "Russian Federation", value: "ru"},
    {label: "Rwanda", value: "rw"},
    {label: "Saint Barthelemy", value: "bl"},
    {label: "Saint Helena", value: "sh"},
    {label: "Saint Kitts And Nevis", value: "kn"},
    {label: "Saint Lucia", value: "lc"},
    {label: "Saint Martin", value: "mf"},
    {label: "Saint Pierre And Miquelon", value: "pm"},
    {label: "Saint Vincent And Grenadines", value: "vc"},
    {label: "Samoa", value: "ws"},
    {label: "San Marino", value: "sm"},
    {label: "Sao Tome And Principe", value: "st"},
    {label: "Saudi Arabia", value: "sa"},
    {label: "Senegal", value: "sn"},
    {label: "Serbia", value: "rs"},
    {label: "Seychelles", value: "sc"},
    {label: "Sierra Leone", value: "sl"},
    {label: "Singapore", value: "sg"},
    {label: "Slovakia", value: "sk"},
    {label: "Slovenia", value: "si"},
    {label: "Solomon Islands", value: "sb"},
    {label: "Somalia", value: "so"},
    {label: "South Africa", value: "za"},
    {label: "South Georgia And Sandwich Island", value: "gs"},
    {label: "Spain", value: "es"},
    {label: "Sri Lanka", value: "lk"},
    {label: "Sudan", value: "sd"},
    {label: "South Sudan", value: "ss"},
    {label: "Suriname", value: "sr"},
    {label: "Svalbard And Jan Mayen", value: "sj"},
    {label: "Swaziland", value: "sz"},
    {label: "Sweden", value: "se"},
    {label: "Switzerland", value: "ch"},
    {label: "Sint Maarten (Dutch part", value: "sx"},
    {label: "Syrian Arab Republic", value: "sy"},
    {label: "Taiwan", value: "tw"},
    {label: "Tajikistan", value: "tj"},
    {label: "Tanzania", value: "tz"},
    {label: "Thailand", value: "th"},
    {label: "TimorLeste", value: "tl"},
    {label: "Togo", value: "tg"},
    {label: "Tokelau", value: "tk"},
    {label: "Tonga", value: "to"},
    {label: "Trinidad And Tobago", value: "tt"},
    {label: "Tunisia", value: "tn"},
    {label: "Turkey", value: "tr"},
    {label: "Turkmenistan", value: "tm"},
    {label: "Turks And Caicos Islands", value: "tc"},
    {label: "Tuvalu", value: "tv"},
    {label: "Uganda", value: "ug"},
    {label: "Ukraine", value: "ua"},
    {label: "United Arab Emirates", value: "ae"},
    {label: "United Kingdom", value: "gb"},
    {label: "United States", value: "us"},
    {label: "United States Outlying Islands", value: "um"},
    {label: "Uruguay", value: "uy"},
    {label: "Uzbekistan", value: "uz"},
    {label: "Vanuatu", value: "vu"},
    {label:  "Venezuela", value: "ve"},
    {label:  "Vietnam", value: "vn"},
    {label: "Virgin Islands British", value: "vg"},
    {label: "Virgin Islands US", value: "vi"},
    {label: "Wallis And Futuna", value: "wf"},
    {label:  "Western Sahara", value: "eh"},
    {label: "Yemen", value: "ye"},
    {label: "Zambia", value: "zm"},
    {label: "Zimbabwe", value: "zw"}
]