
export enum TourGuidePages {
    Products = 'Catalogs/Products',
    ProductsStock = 'Catalogs/ProductsStock',
    Dashboard = 'Dashboard',
    AmazonPreps = 'Documents/AmazonPreps',
    Orders = 'Documents/Orders',
    StockMovement = 'Documents/StockMovement',
    Inbound = 'Documents/Inbound',
    Outbound = 'Documents/Outbound',
    LogisticService = 'Documents/LogisticService',
    Tickets = 'Documents/Tickets',
    Navigation = 'Navigation',
    Invoices = 'Documents/Invoices',
    CodReports = 'Documents/CODReports',
    Report_ProductsOnStocks = "Reports/ProductsOnStocks",
    Report_DeliveryRate = 'Reports/DeliveryRate',
    Report_ReportCodCheck = 'Reports/ReportCodCheck',
    Report_ReportSaleDynamic = 'Reports/ReportSaleDynamic',
    Report_ReportSales = 'Reports/ReportSales',
}

export type TourGuidePagesType = keyof typeof TourGuidePages;


export type TourGuideStepType = {
    target: string;
    content: string;
    disableBeacon?: boolean;
}

