import React from 'react';

interface TitleColumnProps {
    title?: string;
    minWidth: string;
    maxWidth: string;
    contentPosition: string;
    textColor?: string;
    cursor?: string;
    childrenBefore?: React.ReactNode;
    childrenAfter?: React.ReactNode;
    children?: never[];
    className?: string;
}

const TitleColumn: React.FC<TitleColumnProps> = ({ title, minWidth, maxWidth, contentPosition, textColor, cursor, childrenBefore, childrenAfter, children, className=''}) => {
    if (className) console.log("it is classname: ", title, className)
    const style: React.CSSProperties = {
        display: 'flex',
        minWidth: minWidth,
        maxWidth: maxWidth,
        justifyContent: contentPosition,
        alignItems: contentPosition,
        textAlign: contentPosition as React.CSSProperties['textAlign'],
        color: textColor,
        cursor: cursor,
        gap: 5,
    };

    return (
        <div style={style} className={className}>
            {childrenBefore}
            {title && <span>{title}</span>}
            {childrenAfter}
        </div>
    );
};

export default TitleColumn;
