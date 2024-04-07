import React from 'react';
import './styles.scss';


type TutorialHintTooltipPropsType = {
    hint: string;
    classNames?: string;
    children: React.ReactNode;
    position?: 'center'|'left'|'right';
    noMargin?: boolean;
    forBtn?: boolean;
}
const TutorialHintTooltip:React.FC<TutorialHintTooltipPropsType> = ({hint, classNames='', children, position='center', noMargin=false, forBtn=false}) => {
    return (
        <div className={`tutorial-hint-tooltip ${classNames} ${!!hint ? 'has-hint' : 'no-hint'} ${noMargin ? 'no-margin' : ''}`}>
            {children}
            {hint ? <div className={`tutorial-hint-tooltip__text-container is-${position} ${forBtn ? 'for-btn' : ''}`}><span className="tutorial-hint-tooltip__text">{hint}</span></div> : null}
        </div>
    );
}

export default TutorialHintTooltip;
