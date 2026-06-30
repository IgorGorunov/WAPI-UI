import React from "react";
import styles from "./styles.module.scss";
import VideoEmbeddedLoom from "@/components/VideoEmbedded";

type LeadStepInfoType = {
    text: string;
    url?: string;
}

type LeadStepType = {
    title: string;
    info: LeadStepInfoType[];
}

type LeadTutorialStepPropsType = {
    stepData: LeadStepType;
}

const Company:React.FC<LeadTutorialStepPropsType> = ({stepData}) => {
    return (
        <div className={styles['lead-tutorial-step']}>
            {stepData.info.map((item, index) => (
                <div key={`${stepData.title}__step-part_${index}`} className={`${styles['lead-tutorial-step__block']} ${index === 0 ? styles['first-block'] : ''}`}>
                    <p className={styles['lead-tutorial-step-text']}>
                        {index === 0 ? <span className={styles['lead-tutorial-step-title']}>{stepData.title}</span> : null}
                        <span>{item.text}</span>
                    </p>
                    {item.url ?
                        <div className={styles['lead-tutorial-step-video']}>
                            <VideoEmbeddedLoom url={item.url} />
                        </div>
                        : null
                    }
                </div>
            ))}

        </div>
    );
};

export default Company;