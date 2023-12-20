import React from 'react';

interface TableCellProps {
    value?: string;
    minWidth: string;
    maxWidth: string;
    contentPosition: string;
    textColor?: string;
    cursor?: string;
    childrenBefore?: React.ReactNode;
    childrenAfter?: React.ReactNode;
    children?: never[];
    isBlock?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ value, minWidth, maxWidth, contentPosition, textColor, cursor, childrenBefore, childrenAfter, children, isBlock = false }) => {
    const style: React.CSSProperties = {
        display: isBlock ? 'block' : 'flex',
        minWidth: minWidth,
        maxWidth: maxWidth,
        justifyContent: contentPosition,
        alignItems: contentPosition,
        textAlign: contentPosition as React.CSSProperties['textAlign'],
        color: textColor,
        cursor: cursor,
        gap: 5,
    };

    const textSpanStyle: React.CSSProperties = {
        color: textColor, // применение цвета текста
    };

    return (
        <div style={style}>
            {childrenBefore}
            {value && <span style={textSpanStyle}>{value}</span>}
            {childrenAfter}
        </div>
    );
};

export default TableCell;
