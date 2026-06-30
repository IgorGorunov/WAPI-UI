import React from "react";
import styles from "./styles.module.scss";
import leadPageStyles from "../../../styles.module.scss";
import leadTutorialInfo from '../leadTutorialUrlsAndTexts';
import LeadTutorialStep from "@/screens/LeadPage/components/LeadTutorialStep";

const Company:React.FC = () => {
    return (
        <div className={styles['company__container']}>
            <p className={leadPageStyles['welcome-text']}>Welcome! You are on a self serv registration page to start working with WAPI company and get an access to our UI platform. Just follow these steps and get started!</p>
            <LeadTutorialStep key={'lead-step-1'} stepData={leadTutorialInfo.step1} />
            <LeadTutorialStep key={'lead-step-2'} stepData={leadTutorialInfo.step2} />
        </div>
    );
};

export default Company;