import {OptionType} from "@/types/forms";

export enum ANTIFRAUD_ZONES {
    Grey = 'Grey',
    Green = 'Green',
    Yellow = 'Yellow',
    Red = 'Red',
}

export type AntiFraudZoneType = keyof typeof ANTIFRAUD_ZONES;

export enum ANTIFRAUD_ACTIONS {
    Allow = 'Allow',
    Block = 'Block',
}

export type AntiFraudActionType = keyof typeof ANTIFRAUD_ACTIONS;

export enum ANTIFRAUD_COD_TYPES {
    COD = 'COD',
    NoCOD = 'NoCOD',
    All = 'All',
}

export type AntiFraudCountrySettingsType = {
    country: string;
    use: boolean;
}

export type AntiFraudGradationType = {
    key: string;
    zone: AntiFraudZoneType;
    minValue: number;
    maxValue: number;
    action: AntiFraudActionType;
    status: string;
};

export type AntiFraudSettingsFormType = {
    uuid: string;
    code: string;
    use: boolean;
    checkingType: string;
    demoMode: boolean;
    demoOrdersCount: number;
    description: string;
    subscription: string;
    codType: ANTIFRAUD_COD_TYPES;
    startDate: string;
    endDate: string;
    gradation: AntiFraudGradationType[];
    excludedPhoneNumbers: { key: string; phone: string }[];
    countries: AntiFraudCountrySettingsType[];
};



export type AntiFraudDefaultSettingsType = {
    gradation: AntiFraudGradationType;
    countries: AntiFraudCountrySettingsType[];
}

export type AntiFraudSettingsListType = {
    settingsList: AntiFraudSettingsFormType[];
    defaultSettings: AntiFraudDefaultSettingsType;
}

export const ZONE_OPTIONS: OptionType[] = Object.keys(ANTIFRAUD_ZONES).map(k => ({ value: k, label: k }));
export const ACTION_OPTIONS: OptionType[] = Object.keys(ANTIFRAUD_ACTIONS).map(k => ({ value: k, label: k }));
export const COD_TYPE_OPTIONS: OptionType[] = Object.keys(ANTIFRAUD_COD_TYPES).map(k => ({ value: k, label: k }));
export const SUBSCRIPTION_OPTIONS: OptionType[] = [{value: 'Basic', label: 'Standard Check'}, {value: 'Extended', label: 'Advanced Check'}, {value: 'Premium', label: 'Detailed Scoring & Recommendation Check'}]; //['Basic', 'Standard', 'Premium'].map(v => ({ value: v, label: v }));

export const ZONE_COLORS: Record<AntiFraudZoneType, string> = {
    Grey: '#7D8FB3',
    Green: '#29CC39',
    Yellow: '#d4a800',
    Red: '#E62E2E',
};

export const DEFAULT_ZONES = [
    {
        key: 'Gray_01',
        zone: ANTIFRAUD_ZONES.Grey,
        minValue: 0,
        maxValue: 0,
        action: ANTIFRAUD_ACTIONS.Block,
        status: 'No deliveries',
    },
    {
        key: 'Red_02',
        zone: ANTIFRAUD_ZONES.Red,
        minValue: 0.01,
        maxValue: 29.99,
        action: ANTIFRAUD_ACTIONS.Block,
        status: 'Red zone',
    },
    {
        key: 'Yellow_03',
        zone: ANTIFRAUD_ZONES.Yellow,
        minValue: 30,
        maxValue: 69.99,
        action: ANTIFRAUD_ACTIONS.Allow,
        status: 'Yellow zone',
    },
    {
        key: 'Green_04',
        zone: ANTIFRAUD_ZONES.Green,
        minValue: 70,
        maxValue: 100,
        action: ANTIFRAUD_ACTIONS.Allow,
        status: 'Green zone',
    }
];

