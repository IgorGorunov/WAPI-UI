import {AttachedFilesType} from "@/types/utility";

export const ticketStatusColors = [
    { value: 'All statuses', label: 'All statuses' , color: 'var(--color-light-blue-gray)'},
    { value: 'New', label: 'New' , color: 'var(--color-yellow)'},
    { value: 'Reopened', label: 'Reopen' , color: 'var(--color-yellow)'},
    { value: 'In progress', label: 'In progress' , color: 'var(--color-blue)'},
    { value: 'Resolved', label: 'Resolved' , color: 'var(--color-green)'},
    { value: 'Need info from client', label: 'Need info from client', color: 'var(--color-violet)'}
];

export type TicketType = {
    date: string;
    status: string;
    topic: string;
    subject: string;
    description: string;
    result: string;
    subjectUuid: string | null;
    subjectType: string | null;
    uuid: string;
    tableKey: string;
    supportManager: string;
    number: string;
    newMessages: boolean;
    fulfillmentWarehouse: string | null;
    fulfillmentCourierService: string | null;
    fulfillmentCountrySender: string | null;
    fulfillmentCountryReceiver: string | null;
    seller: string;
}

export type TicketTopicType = {
    topic: string;
    AP: boolean;
    FF: boolean;
    Movements: boolean;
    Products: boolean;
    CommonSection: boolean;
}

export type TicketParamsType = {
    statuses: string[];
    topics: string[];
    topicsVisibleParam: TicketTopicType[];
}

export type SingleTicketType = {
    canEdit: boolean;
    status: string;
    uuid: string;
    description: string;
    result: string;
    number: string;
    date: string;
    topic: string;
    subject: string;
    subjectType: string | null;
    subjectUuid: string | null;
    attachedFiles: AttachedFilesType[];
    supportManager: string;
    seller: string;
}

export type ChatMessageType = {
    date: string;
    message: string;
    author: string;
    attachedFiles: AttachedFilesType[];
}

export const enum CHAT_FILE_TYPES {
    PDF = 'application/pdf',
    IMAGE = 'image',
    OTHER = 'other',
}

export enum TICKET_OBJECT_TYPES {
    Fullfilment = 'Fullfilment ',
    AmazonPrep = 'AmazonPrep',
    Inbound ='Inbound',
    Outbound = 'Outbound',
    StockMovement = 'StockMovement',
    LogisticService = 'LogisticService',
    Product = 'Product',
    Ticket = 'Ticket',
}