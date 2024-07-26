import {REPORT_TYPES, ReportsListBlockType} from "@/types/reports";
import {Routes} from "@/types/routes";

export const reportBlocks = (t: any) => [
    {
        blockTitle: t('stockManagement'),
        blockIcon: 'stock-movement',
        blockReports: [
            {
                reportType: REPORT_TYPES.PRODUCTS_ON_STOCKS,
                reportName: "Reports/ProductsOnStocks",
                reportPageLink: Routes.ProductsOnStocks,
                reportDescription: t('reportDescriptions.ProductsOnStocks'),
            },

        ]
    },
    {
        blockTitle: t('kpi'),
        blockIcon: 'trending-up',
        blockReports: [
            {
                reportType: REPORT_TYPES.DELIVERY_RATES,
                reportName: "Reports/DeliveryRate",
                reportPageLink: Routes.DeliveryRates,
                reportDescription: t('reportDescriptions.DeliveryRate'),
            },
            {
                reportType: REPORT_TYPES.REPORT_SALES,
                reportName: "Reports/Sales",
                reportPageLink: Routes.ReportSales,
                reportDescription: t('reportDescriptions.ReportSales'),
            },
            {
                reportType: REPORT_TYPES.SALE_DYNAMIC,
                reportName: 'Reports/SaleDynamic',
                reportPageLink: Routes.SaleDynamic,
                reportDescription: t('reportDescriptions.ReportSaleDynamic'),
            },

        ]
    },
    {
        blockTitle: t('finance'),
        blockIcon: 'finances',
        blockReports: [
            {
                reportType: REPORT_TYPES.COD_REPORT,
                reportName: 'Reports/CodCheck',
                reportPageLink: Routes.CodReport,
                reportDescription: t('reportDescriptions.ReportCodCheck'),
            },

        ]
    },
] as ReportsListBlockType[];