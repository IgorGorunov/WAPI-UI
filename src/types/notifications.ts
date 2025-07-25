import {ChatMessageDirectionType} from "@/types/utility";

export enum NOTIFICATION_STATUSES {
    NEW = 'New',
    READ = 'Read',
    UNREAD = 'Unread',
}

export enum NOTIFICATION_TYPES {
    INFO = 'Info',
    ERROR = 'Error',
    IMPORTANT = 'Important',
    URGENT = 'Urgent',
}

export enum NOTIFICATION_OBJECT_TYPES {
    Fullfilment = '/orders',
    AmazonPrep = '/amazonPrep',
    Inbound ='/inbounds',
    Outbound = '/outbounds',
    StockMovement = '/stockMovements',
    LogisticService = '/logisticServices',
    Product = '/products',
    Ticket = '/tickets',
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
    direction?: ChatMessageDirectionType;
    sender?: string;
    topic?: string;
    seller?: string;
}

export type NotificationResponseType = {
    notifications: NotificationType[];
    notificationsStatuses: {
        [NOTIFICATION_STATUSES.NEW]: number,
        [NOTIFICATION_STATUSES.READ]: number,
        [NOTIFICATION_STATUSES.UNREAD]: number,
    }
}