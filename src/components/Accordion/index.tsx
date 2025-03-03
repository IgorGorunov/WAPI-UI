import React, {useState, useRef, useEffect} from 'react';
import Icon, {IconType} from "@/components/Icon";
import './styles.scss';

type AccordionPropsType = {
    title: string;
    description?: string;
    children?: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (val: boolean)=> void;
    classNames?: string;
    titleIcon?: IconType;
}

const Accordion: React.FC<AccordionPropsType> = ({ title, titleIcon, description='', children, isOpen= false, setIsOpen, classNames='' }) => {
    const [isActive, setIsActive] = useState(isOpen);
    const [height, setHeight] = useState('0px');
    const [showOverflow, setShowOverflow] = useState(isOpen);

    const contentSpace = useRef<HTMLDivElement>(null);

    useEffect(()=>{
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
            setTimeout(()=>setShowOverflow(true), 300)
        } else {
            setShowOverflow(false);
        }
    }, [isActive]);

    return (
        <div className={`accordion-item ${classNames} ${showOverflow ? "is-active" : 'deactivated'}`}>
            <button
                className={`accordion-item__title ${isActive ? "is-active" : ''}`}
                onClick={toggleAccordion}
            >
                <div className="accordion-item__title-wrapper">
                    <p className="accordion-item__title-text">
                        {titleIcon ? (<Icon name={titleIcon} className={'title-icon'}/>) : ''}
                        {title}
                    </p>
                    {description ? <p className="accordion-item__title-dscription">{description}</p> : null}
                </div>
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
