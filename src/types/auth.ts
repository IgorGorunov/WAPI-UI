export type NavAccessItemType = {
    available: boolean;
    access: string
}

export type ManagerInfoType = {
    name: string;
    email: string;
}

export type UserInfoType = {
    testMode: boolean;
    client: string;
    userLogin: string;
    userName: string;
    supportManager?: ManagerInfoType;
}

export type UserBrowserInfoType = {
    userIp: string;
    userLang: string;
    userTimezone: string;
    userAgentData: any;
}

export type UserAccessActionType = {
    objectType: string;
    action: string;
    forbidden: boolean;
}

export enum USER_TYPES {
    OWNER = "Owner",
    OPERATIONAL_TEAM = "Operations team",
    SELLER = "Seller",
}

export enum AccessObjectTypes {
    none = "none",
    'Dashboard' = 'Dashboard',
    "Finances/CODReports" = "Finances/CODReports",
    "Finances/Invoices" = "Finances/Invoices",
    "Orders/AmazonPrep" = "Orders/AmazonPrep",
    "Orders/Fullfillment" = "Orders/Fullfillment",
    "Products/ProductsList" = "Products/ProductsList",
    "Products/ProductsStock" = "Products/ProductsStock",
    "Reports/CodCheck" = "Reports/CodCheck",
    "Reports/DeliveryRate" = "Reports/DeliveryRate",
    "Reports/ProductsOnStocks" = "Reports/ProductsOnStocks",
    "Reports/SaleDynamic" = "Reports/SaleDynamic",
    "Reports/Sales" = "Reports/Sales",
    "StockManagment/Inbounds" = "StockManagment/Inbounds",
    "StockManagment/LogisticServices" = "StockManagment/LogisticServices",
    "StockManagment/Outbounds" = "StockManagment/Outbounds",
    "StockManagment/StockMovements" = "StockManagment/StockMovements",
    "Tickets" = "Tickets",
    "Profile/Prices" = "Profile/Prices",
    "Profile/Contracts" = "Profile/Contracts",
    "Profile/DeliveryProtocols" = "Profile/DeliveryProtocols",
    "Profile/WarehouseInfo" = "Profile/WarehouseInfo",
    "Profile/ChangePassword" = "Profile/ChangePassword",
    "FAQ" = 'FAQ',
}

export enum AccessActions {
    none = "none",
    "ViewObject" = "ViewObject",
    "EditObject" = "EditObject",
    "ExportList" = "ExportList",
    "BulkCreate" = "BulkCreate",
    "ListView" = "ListView",
    "CreateObject" = "CreateObject",
    "GenerateReport" = "GenerateReport",
    "DownloadReport" = "DownloadReport",
    "View" = "View",
    "DownloadPrintForm" = "DownloadPrintForm",
}
