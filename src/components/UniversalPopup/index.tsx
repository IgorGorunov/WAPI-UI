import React from "react";
import "./styles.scss";
import Icon from "@/components/Icon";

type PopupItem = {
    title: string;
    description: string | number;
};

type PopupPropsType = {
    items: PopupItem[];
    position: 'left' | 'right';
    width?: number | null;
    handleClose?: () => void;
};

const UniversalPopup: React.FC<PopupPropsType> = ({ items, position, width, handleClose }) => {
    if (items.length === 0) {
        return null;
    }

    const positionClass = `universal-popup__wrapper--${position}`;
    const wrapperStyle = width !== null ? { width: width + 'px' } : {};

    return (
        <div className={`universal-popup ${positionClass} ${!!handleClose ? 'has-close-icon' : ''}`} style={wrapperStyle}>
            {!!handleClose ? (<a className="universal-popup__close" href="#" onClick={handleClose}>
                <Icon name='close' />
            </a>) : null }
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
