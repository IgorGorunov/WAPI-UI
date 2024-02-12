import {REPORT_TYPES, ReportsListBlockType} from "@/types/reports";
import {Routes} from "@/types/routes";

export const reportBlocks: ReportsListBlockType[] = [
    {
        blockTitle: 'Stock management',
        blockIcon: 'stock-movement',
        blockReports: [
            {
                reportType: REPORT_TYPES.PRODUCTS_ON_STOCKS,
                reportPageLink: Routes.ProductsOnStocks,
            },

        ]
    },
    {
        blockTitle: 'KPI',
        blockIcon: 'trending-up',
        blockReports: [
            {
                reportType: REPORT_TYPES.DELIVERY_RATES,
                reportPageLink: Routes.DeliveryRates,
            },
            {
                reportType: REPORT_TYPES.REPORT_SALES,
                reportPageLink: Routes.ReportSales,
            },
            {
                reportType: REPORT_TYPES.SALE_DYNAMIC,
                reportPageLink: Routes.SaleDynamic,
            },

        ]
    },
]