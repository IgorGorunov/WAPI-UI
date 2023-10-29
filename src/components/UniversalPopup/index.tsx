import React from "react";
import "./styles.scss";

type PopupItem = {
    title: string;
    description: string | number;
};

type PopupPropsType = {
    items: PopupItem[];
    position?: 'left' | 'right';
};

const UniversalPopup: React.FC<PopupPropsType> = ({ items, position = 'right' }) => {
    return (
        <div className={`universal-popup__wrapper${position === 'right' ? '--right' : '--left'}`}>
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
