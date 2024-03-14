import React from "react";

export const formatMessage_firstSymbols = (messageText: string, messageLength = 50) => {
    if (messageText.length > messageLength) {
        return messageText.substring(0,messageLength)+'...';
    }
    return messageText;
}

export const splitMessage = (text: string, breakSymbol='<br>') => {
    const textArr = text.split(breakSymbol);
    return textArr.map(item => <span className='new-line'>{item}</span>);
}