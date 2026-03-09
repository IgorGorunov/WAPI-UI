import React, { useState, useRef, useEffect } from 'react';
import Icon from "@/components/Icon";
import ToggleSwitch from "@/components/FormBuilder/ToggleSwitch";
import styles from "./styles.module.scss";

type AccordionPropsType = {
    title: string;
    description?: string;
    children?: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (val: boolean) => void;
    classNames?: string;
    hasToggle?: boolean;
    toggleName?: string;
    toggleTitle?: string;
    toggleValue?: boolean;
    onToggleChange?: () => void;
}

const Accordion: React.FC<AccordionPropsType> = (
    {
        title,
        description = '',
        children,
        isOpen = false,
        setIsOpen,
        classNames = '',
        hasToggle = false,
        toggleTitle = '',
        toggleName = '',
        toggleValue = false,
        onToggleChange
    }) => {

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
        <div className={`${styles['cookie-accordion-item']} ${classNames} ${showOverflow ? styles['is-active'] || "is-active" : styles['deactivated'] || "deactivated"}`}>
            <button
                className={`${styles['cookie-accordion-item__title']} ${isActive ? styles['is-active'] || "is-active" : ''}`}
                onClick={toggleAccordion}
            >
                <div className={styles['cookie-accordion-item__title-wrapper']}>
                    <Icon name='keyboard-arrow-up' className={`${styles['cookie-accordion-item__title-icon']} ${isActive ? styles['active'] || 'active' : ''}`} />
                    <p className={`${styles['cookie-accordion-item__title-text']} ${hasToggle ? styles['has-toggle'] || 'has-toggle' : styles['no-toggle'] || 'no-toggle'} ${isActive ? styles['active'] || 'active' : ''}`}>
                        {title}
                    </p>
                    {description ? <p className="cookie-accordion-item__title-dscription">{description}</p> : null}

                </div>
                {/*<Icon name='keyboard-arrow-up' className={`accordion-item__title-icon ${isActive ? 'active' : ''}`}/>*/}
            </button>
            <div className={styles['cookie-accordion-item__title-toggle']}>
                {hasToggle ?
                    <ToggleSwitch name={toggleName} value={toggleValue} onChange={onToggleChange} />
                    : <p className={styles['cookie-accordion-item__title-toggle-title']}>{toggleTitle}</p>}
            </div>
            <div
                ref={contentSpace}
                style={{ maxHeight: `${height}` }}
                className={styles['cookie-accordion-item__content-wrapper']}
            >
                <div className={styles['cookie-accordion-item__content']}>{children}</div>
            </div>
        </div>
    );
};

export default Accordion;
