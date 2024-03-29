
import {SubmenuBlockType} from "@/components/Navigation/SubmenuBlock";

export const navBlocks: SubmenuBlockType[] = [
    {
        submenuTitle: 'Products',
        submenuIcon: 'products',
        navItems: [
            {
                title: 'Products list',
                link: '/products',
            },
            {
                title: 'Products stock',
                link: '/productsStock',
            }
        ]
    },
    {
        submenuTitle: 'Orders',
        submenuIcon: 'orders',
        navItems: [
            {
                title: 'Fulfillment',
                link: '/orders',
            },
            {
                title: 'Amazon Prep',
                link: '/amazonPrep',
            }
        ]
    },
    {
        submenuTitle: 'Finances',
        submenuIcon: 'finances',
        navItems: [
            {
                title: 'Invoices',
                link: '/invoices',
            },
            {
                title: 'COD reports',
                link: '/codReports',
            }
        ]
    },
    {
        submenuTitle: 'Stock management',
        submenuIcon: 'stock-movement',
        navItems: [
            {
                title: 'Inbounds',
                link: '/inbounds',
            },
            {
                title: 'Stock movements',
                link: '/stockMovements',
            },
            {
                title: 'Outbounds',
                link: '/outbounds',
            }
        ]
    },
    {
        submenuTitle: 'Reports',
        submenuIcon: 'reports-folder',
        submenuLink: '/reports',
        navItems: []
    },
    {
        submenuTitle: 'Tickets',
        submenuIcon: 'ticket',
        submenuLink: '/tickets',
        navItems: []
    },
];