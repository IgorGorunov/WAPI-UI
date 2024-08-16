export const enum ModalTypes {
    MAIN = 'main',
    STATUS = 'status',
    PREVIEW = 'preview',
    CONFIRM = 'confirm',
    API_ERROR = 'api-error'
}

export const enum STATUS_MODAL_TYPES {
    SUCCESS = 'success',
    ERROR = 'error',
    NOTIFICATION = 'notification',
    MESSAGE = 'message',
}

export const enum SEND_COMMENT_TYPES {
    REDELIVERY_SAME_ADDRESS = "Redelivery to the same address",
    BACK_TO_SENDER = "Delivery back to the sender",
    STORAGE = "Storage at courier agency",
    REDELIVERY_ANOTHER_ADDRESS = "Redelivery to another address",
}

export const SendCommentTypesArray = [
    SEND_COMMENT_TYPES.REDELIVERY_SAME_ADDRESS,
    SEND_COMMENT_TYPES.REDELIVERY_ANOTHER_ADDRESS,
    SEND_COMMENT_TYPES.STORAGE,
    SEND_COMMENT_TYPES.BACK_TO_SENDER,
]

export type AttachedFilesType = {
    id: string;
    name: string;
    type: string;
    data: string;
}

export type WarehouseType = {
    warehouse: string;
    courierService: string;
    country: string;
}

export const enum FILTER_TYPE {
    CHECKBOX = 'checkbox',
    COLORED_CIRCLE = 'colored-circle',
}

export type DocProductParamsType = {
    tableKey: string;
    name: string;
    sku: string;
    uuid: string;
    volume: number;
    weightGross: number;
    weightNet: number;
    aliases: string;
    barcodes: string;
    volumeWeight?: number;
    //unitOfMeasures: string[];
}

export type ProductsSelectionType = {
    uuid: string;
    name: string;
    sku: string;
    aliases: string;
    barcodes: string;
    warehouse: string;
    country: string;
    available: number;
    selected?: number;
    weightNet: number;
    weightGross: number;
    volumeWeight: number;
    volume: number;
    key?: string;
}

export const enum ChatMessageDirectionType {
    ToUser = 'User-UI',
    FromUser = 'UI-User',
}

export type BasicDocListQueryType = {
    page?: number;
    pageSize?: number;
    periodStart?: string;
    periodEnd?: string;
}



