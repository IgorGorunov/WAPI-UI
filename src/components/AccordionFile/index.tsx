import React, {useState, useRef, useEffect} from 'react';
import Icon from "@/components/Icon";
import './styles.scss';

type AccordionFilePropsType = {
    title: string;
    children?: React.ReactNode;
    isOpen?: boolean;
}

const AccordionFile: React.FC<AccordionFilePropsType> = ({ title, children, isOpen= false }) => {
    const [isActive, setIsActive] = useState(isOpen);

    const contentSpace = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if (isOpen) {

            if (!isActive) {
                setIsActive(true);
            }
        }
    }, [isOpen]);

    const toggleAccordion = (e) => {
        e.preventDefault();
        setIsActive((prevState) => !prevState);
    }

    return (
        <div className="accordion-file-item">
            <button
                className={`accordion-file-item__title ${isActive ? "is-active" : ''}`}
                onClick={toggleAccordion}
            >
                {/*<Icon name='minus' className={`accordion-file-item__title-icon active`} />*/}
                <Icon name='keyboard-arrow-up' className={`accordion-file-item__title-icon ${isActive ? 'active' : ''}`}/>
                <p className="accordion-file-item__title-text"><Icon name='folder' className='folder-icon' />{title}</p>

            </button>
            <div
                ref={contentSpace}
                className="accordion-file-item__content-wrapper"
            >
                {isActive ? <div className='accordion-file-item__content'>{children}</div> : null}
            </div>
        </div>
    );
};

export default AccordionFile;
