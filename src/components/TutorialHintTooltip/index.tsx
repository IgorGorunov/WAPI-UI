import React from 'react';
import styles from "./styles.module.scss";



type TutorialHintTooltipPropsType = {
    hint: string;
    classNames?: string;
    children: React.ReactNode;
    position?: 'center' | 'left' | 'right';
    noMargin?: boolean;
    forBtn?: boolean;
    positionTop?: boolean;
}
const TutorialHintTooltip: React.FC<TutorialHintTooltipPropsType> = ({ hint, classNames = '', children, position = 'center', noMargin = false, forBtn = false, positionTop = false }) => {
    return (
        <div className={`${styles['tutorial-hint-tooltip']} tutorial-hint-tooltip ${classNames} ${!!hint ? `${styles['has-hint'] || 'has-hint'}` : `${styles['no-hint'] || 'no-hint'}`} ${noMargin ? `${styles['no-margin'] || 'no-margin'}` : ''} ${positionTop ? `${styles['is-top'] || 'is-top'} is-top` : ''}`}>
            {children}
            {hint ? <div className={`${styles['tutorial-hint-tooltip__text-container']} tutorial-hint-tooltip__text-container ${styles[`is-${position}`] || `is-${position}`} ${forBtn ? `${styles['for-btn'] || 'for-btn'} for-btn` : ''} ${positionTop ? `${styles['is-top'] || 'is-top'} is-top` : ''}`}><span className={`${styles['tutorial-hint-tooltip__text']} tutorial-hint-tooltip__text`}>{hint}</span></div> : null}
        </div>
    );
}

export default TutorialHintTooltip;
