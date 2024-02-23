export const formatMessage_firstSymbols = (messageText: string, messageLength = 50) => {
    if (messageText.length > messageLength) {
        return messageText.substring(0,messageLength)+'...';
    }
    return messageText;
}