import React, { useState, useRef } from 'react';
import Icon from "@/components/Icon";
import './styles.scss';

type AccordionPropsType = {
    title: string;
    children?: React.ReactNode;
}

const Accordion: React.FC<AccordionPropsType> = ({ title, children }) => {
    const [isActive, setIsActive] = useState(false);
    const [height, setHeight] = useState('0px');

    const contentSpace = useRef<HTMLDivElement>(null)

    const toggleAccordion = (e) => {
        e.preventDefault();
        setIsActive((prevState) => !prevState)
        setHeight(isActive ? '0px' : `${contentSpace.current.scrollHeight}px`);
    }

    return (
        <div className="accordion-item">
            <button
                className={`accordion-item__title ${isActive ? "is-active" : ''}`}
                onClick={toggleAccordion}
            >
                <p className="accordion-item__title-text">{title}</p>
                <Icon name='keyboard-arrow-up' className={`accordion-item__title-icon ${isActive ? 'active' : ''}`}/>
            </button>
            <div
                ref={contentSpace}
                style={{ maxHeight: `${height}` }}
                className="accordion-item__content-wrapper"
            >
                <div className='accordion-item__content'>{children}</div>
            </div>
        </div>
    );
};

export default Accordion;
