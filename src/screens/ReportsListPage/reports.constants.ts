import {REPORT_TYPES, ReportsListBlockType} from "@/types/reports";
import {Routes} from "@/types/routes";

export const reportBlocks: ReportsListBlockType[] = [
    {
        blockTitle: 'Stock management',
        blockIcon: 'stock-movement',
        blockReports: [
            {
                reportType: REPORT_TYPES.PRODUCTS_ON_STOCKS,
                reportName: "Reports/ProductsOnStocks",
                reportPageLink: Routes.ProductsOnStocks,
                reportDescription: 'The report shows history of product movements',
            },

        ]
    },
    {
        blockTitle: 'KPI',
        blockIcon: 'trending-up',
        blockReports: [
            {
                reportType: REPORT_TYPES.DELIVERY_RATES,
                reportName: "Reports/DeliveryRate",
                reportPageLink: Routes.DeliveryRates,
                reportDescription: 'The report shows information about buyout',
            },
            {
                reportType: REPORT_TYPES.REPORT_SALES,
                reportName: "Reports/Sales",
                reportPageLink: Routes.ReportSales,
                reportDescription: 'The report shows the number of orders and items - by country of the customer, product and order.',
            },
            {
                reportType: REPORT_TYPES.SALE_DYNAMIC,
                reportName: 'Reports/SaleDynamic',
                reportPageLink: Routes.SaleDynamic,
                reportDescription: 'This report shows dynamic of your sales',
            },

        ]
    },
    {
        blockTitle: 'Finance',
        blockIcon: 'finances',
        blockReports: [
            {
                reportType: REPORT_TYPES.COD_REPORT,
                reportName: 'Reports/CodCheck',
                reportPageLink: Routes.CodReport,
                reportDescription: 'The report shows COD paid, reported and total balance for time frames set',
            },

        ]
    },
]