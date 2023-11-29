import React from 'react';

interface TableCellProps {
    value?: string;
    width: string;
    contentPosition: string;
    textColor?: string;
    cursor?: string;
    childrenBefore?: React.ReactNode;
    childrenAfter?: React.ReactNode;
    children?: never[];
    isBlock?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ value, width, contentPosition, textColor, cursor, childrenBefore, childrenAfter, children, isBlock = false}) => {
    const style: React.CSSProperties = {
        display: isBlock ? 'block' : 'flex',
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
            {value && <span>{value}</span>}
            {childrenAfter}
        </div>
    );
};

export default TableCell;
