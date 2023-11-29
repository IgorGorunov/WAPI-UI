import React from 'react';

interface TitleColumnProps {
    title?: string;
    width: string;
    contentPosition: string;
    textColor?: string;
    cursor?: string;
    childrenBefore?: React.ReactNode;
    childrenAfter?: React.ReactNode;
    children?: never[];
}

const TitleColumn: React.FC<TitleColumnProps> = ({ title, width, contentPosition, textColor, cursor, childrenBefore, childrenAfter, children}) => {
    const style: React.CSSProperties = {
        display: 'flex',
        minWidth: width,
        justifyContent: contentPosition,
        alignItems: contentPosition,
        textAlign: contentPosition as React.CSSProperties['textAlign'],
        color: textColor,
        cursor: cursor,
        gap: 5,
    };

    return (
        <div style={style}>
            {childrenBefore}
            {title && <span>{title}</span>}
            {childrenAfter}
        </div>
    );
};

export default TitleColumn;
