import React, { useState, useRef, useEffect } from 'react';
import Icon, { IconType } from "@/components/Icon";
import styles from "./styles.module.scss";

type AccordionPropsType = {
    title: string;
    titleAmount?: string;
    description?: string;
    children?: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (val: boolean) => void;
    classNames?: string;
    titleIcon?: IconType;
}

const Accordion: React.FC<AccordionPropsType> = ({ title, titleAmount, titleIcon, description = '', children, isOpen = false, setIsOpen, classNames = '' }) => {
    const [isActive, setIsActive] = useState(isOpen);
    const [height, setHeight] = useState('0px');
    const [showOverflow, setShowOverflow] = useState(isOpen);

    const contentSpace = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && contentSpace?.current) {
            setHeight(`${contentSpace.current.scrollHeight}px`);

            if (!isActive) {
                setIsActive(true);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen || isActive) {
            setHeight(`${contentSpace.current.scrollHeight}px`);
        }
    }, [children]);

    useEffect(() => {
        if (!isActive && isOpen) {
            setIsOpen(false);
        }
    }, [isActive]);


    const toggleAccordion = (e) => {
        e.preventDefault();
        setIsActive((prevState) => !prevState);
        setHeight(isActive ? '0px' : `${contentSpace.current.scrollHeight}px`);
    }

    useEffect(() => {
        if (isActive) {
            setTimeout(() => setShowOverflow(true), 300)
        } else {
            setShowOverflow(false);
        }
    }, [isActive]);

    return (
        <div className={`${styles['accordion-item']} ${classNames} ${showOverflow ? styles['is-active'] || 'is-active' : styles['deactivated'] || 'deactivated'}`}>
            <button
                className={`${styles['accordion-item__title']} ${isActive ? styles['is-active'] || 'is-active' : ''}`}
                onClick={toggleAccordion}
            >
                <div className={styles['accordion-item__title-wrapper']}>
                    <p className={styles['accordion-item__title-text']}>
                        {titleIcon ? (<Icon name={titleIcon} className={styles['title-icon'] || 'title-icon'} />) : ''}
                        {title}
                        {titleAmount ? <span className={`${styles['accordion-item__title-text__amount']} ${titleAmount && titleAmount != '0' ? styles['checked'] || 'checked' : ''}`}>{titleAmount}</span> : null}
                    </p>
                    {description ? <p className="accordion-item__title-dscription">{description}</p> : null}
                </div>
                <Icon name='keyboard-arrow-up' className={`${styles['accordion-item__title-icon']} ${isActive ? styles['active'] || 'active' : ''}`} />
            </button>
            <div
                ref={contentSpace}
                style={{ maxHeight: `${height}` }}
                className={styles['accordion-item__content-wrapper']}
            >
                <div className={styles['accordion-item__content']}>{children}</div>
            </div>
        </div>
    );
};

export default Accordion;
