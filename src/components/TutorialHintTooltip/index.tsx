import React from 'react';
import styles from "./styles.module.scss";



type TutorialHintTooltipPropsType = {
    hint: string;
    classNames?: string;
    children: React.ReactNode;
    position?: 'center' | 'left' | 'right';
    noMargin?: boolean;
    forBtn?: boolean;
}
const TutorialHintTooltip: React.FC<TutorialHintTooltipPropsType> = ({ hint, classNames = '', children, position = 'center', noMargin = false, forBtn = false }) => {
    return (
        <div className={`${styles['tutorial-hint-tooltip']} ${classNames} ${!!hint ? styles['has-hint'] || 'has-hint' : styles['no-hint'] || 'no-hint'} ${noMargin ? styles['no-margin'] || 'no-margin' : ''}`}>
            {children}
            {hint ? <div className={`${styles['tutorial-hint-tooltip__text-container']} ${styles[`is-${position}`] || `is-${position}`} ${forBtn ? styles['for-btn'] || 'for-btn' : ''}`}><span className={styles['tutorial-hint-tooltip__text']}>{hint}</span></div> : null}
        </div>
    );
}

export default TutorialHintTooltip;
