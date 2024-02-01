import React, {useState, useRef, useEffect} from 'react';
import Icon from "@/components/Icon";
import './styles.scss';

type AccordionPropsType = {
    title: string;
    children?: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (val: boolean)=> void;
}

const Accordion: React.FC<AccordionPropsType> = ({ title, children, isOpen= false, setIsOpen }) => {
    const [isActive, setIsActive] = useState(isOpen);
    const [height, setHeight] = useState('0px');

    const contentSpace = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        console.log('check1')
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

    console.log('check0', isOpen, isActive)

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
