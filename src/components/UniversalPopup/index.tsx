import React from "react";
import "./styles.scss";

type PopupItem = {
    title: string;
    description: string | number;
};

type PopupPropsType = {
    items: PopupItem[];
    position: 'left' | 'right';
    width?: number | null;
};

const UniversalPopup: React.FC<PopupPropsType> = ({ items, position, width }) => {
    if (items.length === 0) {
        return null;
    }

    const positionClass = `universal-popup__wrapper--${position}`;
    const wrapperStyle = width !== null ? { width: width + 'px' } : {};

    return (
        <div className={positionClass} style={wrapperStyle}>
            <ul className="universal-popup__list">
                {items.map((item: PopupItem, index: number) => (
                    <li key={item.title + index} className="universal-popup__item">
                        <p className="universal-popup__item-text">{item.title}</p>
                        <p>{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UniversalPopup;
