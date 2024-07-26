export const navigationStepsFull = (t) => [
    {
        target: '.dashboard-menu-link .button-link',
        content: t('dashboard'),
        disableBeacon: true,
        submenuName: 'Dashboard',
    },
    {
        target: '.submenu-container.Products',
        content: t('products'),
        disableBeacon: true,
        submenuName: 'Products',
    },
    {
        target: '.submenu-container.Orders',
        content: t('orders'),
        disableBeacon: true,
        submenuName: 'Orders',
    },
    {
        target: '.submenu-container.Finances',
        content: t('finances'),
        disableBeacon: true,
        submenuName: 'Finances',
    },
    {
        target: '.submenu-container.Stockmanagement',
        content: t('stockManagement'),
        disableBeacon: true,
        submenuName: 'StockManagment',
    },
    {
        target: '.submenu-single-item.Reports',
        content: t('reports'),
        disableBeacon: true,
        submenuName: 'Reports',
    },
    {
        target: '.submenu-single-item.Tickets',
        content: t('tickets'),
        disableBeacon: true,
        submenuName: 'Tickets',
    },

]