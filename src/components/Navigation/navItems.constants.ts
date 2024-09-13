
export const navBlocks = (unreadAmount: number = 0) => ([
    {
        submenuTitle: 'Products',
        submenuName: "Products",
        submenuIcon: 'products',
        navItems: [
            {
                title: 'Products list',
                name: "Products/ProductsList",
                link: '/products',
            },
            {
                title: 'Products stock',
                name: "Products/ProductsStock",
                link: '/productsStock',
            }
        ]
    },
    {
        submenuTitle: 'Orders',
        submenuName: "Orders",
        submenuIcon: 'orders',
        navItems: [
            {
                title: 'Fulfillment',
                name: "Orders/Fullfillment",
                link: '/orders',
            },
            {
                title: 'Amazon prep',
                name: "Orders/AmazonPrep",
                link: '/amazonPrep',
            }
        ]
    },
    {
        submenuTitle: 'Finances',
        submenuName: 'Finances',
        submenuIcon: 'finances',
        navItems: [
            {
                title: 'Invoices',
                name: "Finances/Invoices",
                link: '/invoices',
            },
            {
                title: 'COD reports',
                name: 'Finances/CODReports',
                link: '/codReports',
            }
        ]
    },
    {
        submenuTitle: 'Stock management',
        submenuName: "StockManagment",
        submenuIcon: 'stock-movement',
        navItems: [
            {
                title: 'Inbounds',
                name: "StockManagment/Inbounds",
                link: '/inbounds',
            },
            {
                title: 'Stock movements',
                name: "StockManagment/StockMovements",
                link: '/stockMovements',
            },
            {
                title: 'Outbounds',
                name: "StockManagment/Outbounds",
                link: '/outbounds',
            },
            {
                title: 'Logistic services',
                name: "StockManagment/LogisticServices",
                link: '/logisticServices',
            }
        ]
    },
    {
        submenuTitle: 'Reports',
        submenuName: "Reports",
        submenuIcon: 'reports-folder',
        submenuLink: '/reports',
        navItems: [],
    },
    {
        submenuTitle: `Tickets (${unreadAmount})`,
        submenuName: "Tickets",
        submenuIcon: 'ticket',
        submenuLink: '/tickets?filter=Has new messages',
        navItems: [],
    },
]);