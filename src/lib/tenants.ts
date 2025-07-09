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
};

export type OrdersTenantDataType = {
    trackingNumberTitle: string;
    carrierTitle: string;
    stockMovStandardDeliveryTitle: string;
    stockMovExpressDeliveryTitle: string;
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
    orderTitles: OrdersTenantDataType;
}

export enum TENANTS {
    WAPI = 'WAPI',
    N1NDGLOBAL = 'N1NDGLOBAL',
}

export type TENANT_TYPE = keyof typeof TENANTS;

export const tenants = {
    'n1globalpay.com': TENANTS.N1NDGLOBAL,
    'wapi-ui-git-whitelabel-wapi.vercel.app': TENANTS.N1NDGLOBAL,
    'ui.wapi.com': TENANTS.WAPI,
    'localhost': TENANTS.N1NDGLOBAL,
    'https://wapi-ui-git-whitelabel-wapi.vercel.app': TENANTS.N1NDGLOBAL,

};

export const tenantsData = {
    [TENANTS.WAPI]: {
        id: TENANTS.WAPI,
        alias: 'wapi',
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
        orderTitles: {
            trackingNumberTitle: 'WAPI tracking number',
            carrierTitle: 'WAPI carrier',
            stockMovExpressDeliveryTitle: 'WAPI Express',
            stockMovStandardDeliveryTitle: 'WAPI Standard',

        },
    } as TenantDataType,

    [TENANTS.N1NDGLOBAL]: {
        id: TENANTS.N1NDGLOBAL,
        alias: 'N1NDGLOBAL',
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
                    text: 'n1globalpay.com',
                    link: 'https://n1globalpay.com/',
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
        uiLink: 'https://n1globalpay.com/',
        orderTitles: {
            trackingNumberTitle: 'Warehouse tracking number',
            carrierTitle: 'N1ND GLOBAL carrier',
            stockMovExpressDeliveryTitle: 'N1ND GLOBAL Express',
            stockMovStandardDeliveryTitle: 'N1ND GLOBAL Standard',
        }
    } as TenantDataType,
}

export const getTenantData = (tenant: TENANT_TYPE): TenantDataType => {
    console.log('tenant data: ', tenant, tenantsData[tenant], '--', tenantsData);
    return tenantsData[tenant] || null;
}