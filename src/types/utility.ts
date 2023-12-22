export const enum ModalTypes {
    MAIN = 'main',
    STATUS = 'status',
    COMMENT = 'comment'
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

