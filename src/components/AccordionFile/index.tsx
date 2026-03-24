import React, {useState, useRef, useEffect} from 'react';
import Icon from "@/components/Icon";
import styles from './styles.module.scss';

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
        <div className={styles["accordion-file-item"]}>
            <button
                className={`${styles["accordion-file-item__title"]} ${isActive ? styles["is-active"] || "is-active" : ''}`}
                onClick={toggleAccordion}
            >
                {/*<Icon name='minus' className={`${styles["accordion-file-item__title-icon"]} ${styles.active}`} />*/}
                <Icon name='keyboard-arrow-up' className={`${styles["accordion-file-item__title-icon"]} ${isActive ? styles.active || 'active' : ''}`}/>
                <p className={styles["accordion-file-item__title-text"]}><Icon name='folder' className={styles["folder-icon"] || "folder-icon"} />{title}</p>

            </button>
            <div
                ref={contentSpace}
                className={styles["accordion-file-item__content-wrapper"]}
            >
                {isActive ? <div className={styles['accordion-file-item__content']}>{children}</div> : null}
            </div>
        </div>
    );
};

export default AccordionFile;
