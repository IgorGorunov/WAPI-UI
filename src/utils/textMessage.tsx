import React from "react";

export const formatMessage_firstSymbols = (messageText: string, messageLength = 50) => {
    if (messageText.length > messageLength) {
        return messageText.substring(0,messageLength)+'...';
    }
    return messageText;
}

export const camelCaseToSentence = (input: string) => {
    const result = input.replace(/([A-Z])/g, ' $1').trim();
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}

export const splitMessage = (text: string, breakSymbol='<br>') => {
    const textArr = text ? text.split(breakSymbol) : [''];

    return textArr.map((item, index) => <span key={`${item}_${index}`} className='new-line'>{item}</span>);
}