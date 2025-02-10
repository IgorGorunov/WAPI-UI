import React, {memo, useEffect, useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import {Tooltip} from "antd";



type CardWithHelpIconPropsType = {
    classNames?: string;
    showHintsByDefault?: boolean;
    children: React.ReactNode[] | React.ReactNode;
};

const CardWithHelpIcon: React.FC<CardWithHelpIconPropsType> = ({ classNames='', showHintsByDefault=false, children }) => {
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        if (showHintsByDefault) {
            setShowHelp(true);
        }
    }, [showHintsByDefault]);

    return (
        <div className={`card card-with-help-icon ${showHelp ? 'tutorial-mode' : ''} ${classNames}`}>
            <Tooltip title={`${showHelp ? 'Click this icon to hide hints' : 'Click this icon to display hints'}`}>
                <button className='card-question-btn' type='button' onClick={()=>setShowHelp(prevState=>!prevState)}>
                   <Icon name='question' />
                </button>
            </Tooltip>
           {children}
        </div>
    );
};

export default memo(CardWithHelpIcon);
