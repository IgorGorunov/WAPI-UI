export enum NOTIFICATION_STATUSES {
    NEW = 'New',
    READ = 'Read',
    UNREAD = 'Unread',
}

export enum NOTIFICATION_TYPES {
    INFO = 'Info',
    ERROR = 'Error',
}

export enum NOTIFICATION_OBJECT_TYPES {
    Fullfilment = '/orders',
    AmazonPrep = '/amazonPrep',
    Inbound ='/inbounds',
    Outbound = '/outbounds',
    StockMovement = '/stockMovements',
    Product = '/products',
}

export type NotificationType = {
    uuid: string;
    status: NOTIFICATION_STATUSES;
    period: string;
    type: NOTIFICATION_TYPES;
    title: string;
    message: string;
    objectType: NOTIFICATION_OBJECT_TYPES;
    objectUuid: string;
}

export type NotificationResponseType = {
    notifications: NotificationType[];
    notificationsStatuses: {
        [NOTIFICATION_STATUSES.NEW]: number,
        [NOTIFICATION_STATUSES.READ]: number,
        [NOTIFICATION_STATUSES.UNREAD]: number,
    }
}