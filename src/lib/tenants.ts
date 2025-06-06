export type TenantFooterDataType = {
    logo: string;
    logoWidth: number;
    logoHeight: number;
    logoPaddingTop: number;
    copyright: string;
    address: string;
}

export type PrivacyPolicyDataType = {
    regNumber: string;
    legalAddress: string;
    contactInfo: {
        isAvailable: boolean;
        websiteText: string;
        websiteLink: string;
    };
    websites: {
        text:string,
        link:string
    }[];
}

export type TenantDataType = {
    id: string;
    alias: string;
    logo: string;
    name: string;
    email: string;
    footer: TenantFooterDataType;
    privacyPolicy: PrivacyPolicyDataType;
    mainWebsite: string;
    uiLink: string;
}

export enum TENANTS {
    WAPI = 'WAPI',
    N1 = 'N1',
}

export type TENANT_TYPE = keyof typeof TENANTS;

export const tenants = {
    'ui.wapi.com': TENANTS.WAPI,
    'localhost:3000': TENANTS.N1,
};

export const tenantsData = {
    [TENANTS.WAPI]: {
        id: TENANTS.WAPI,
        alias: 'WAPI',
        name: 'WAPI OÜ',
        logo: '/logo.png',
        email: 'info@wapi.com',
        privacyPolicy: {
            regNumber: '14699305',
            legalAddress: 'Harju maakond, Tallinn, Mustamäe linnaosa, Kadaka tee 7, 12915',
            contactInfo: {
                isAvailable: true,
                websiteText: 'wapi.com',
                websiteLink: 'https://wapi.com/',
            },
            websites: [
                {
                    text: 'wapi.com',
                    link: 'https://wapi.com/',
                },
                {
                    text: 'ui.wapi.com',
                    link: 'https://ui.wapi.com/',
                },

            ],
        },
        footer: {
            logo: '/logo.png',
            logoPaddingTop: 20,
            logoWidth: 200,
            logoHeight: 100,
            copyright:  'all rights reserved by – WAPI OÜ',
            address: 'Kadaka tee 7, Mustamae linnaosa, Tallinn, 12915 Estonia WAPI OÜ, Reg no. 14699305',
        },
        mainWebsite: 'https://wapi.com',
        uiLink: 'https://ui.wapi.com',
    } as TenantDataType,

    [TENANTS.N1]: {
        id: TENANTS.N1,
        alias: 'BERGOT LTD',
        name: 'N1ND GLOBAL',
        logo: '/N1-logo.png',
        email: 'info@n1storeworld.com',
        privacyPolicy: {
            regNumber: '39.602.862/0001-20',
            legalAddress: 'RUA NITEROI 365, SCS, SP, O9751-100, BRASIL',
            contactInfo: {
                isAvailable: false,
                websiteText: '',
                websiteLink: '',
            },
            websites: [
                {
                    text: 'some.website.com7с',
                    link: 'https://google.com/',
                },
            ],
        },
        footer: {
            logo: '/N1-logo-clear.png',
            logoWidth: 80,
            logoHeight: 69,
            logoPaddingTop: 0,
            copyright: 'all rights reserved by N1ND GLOBAL',
            address: '',
        },
        mainWebsite: '',
        uiLink: 'https://google.com/',
    } as TenantDataType,
}

export const getTenantData = (tenant: TENANT_TYPE): TenantDataType => {
    return tenantsData[tenant] || null;
}