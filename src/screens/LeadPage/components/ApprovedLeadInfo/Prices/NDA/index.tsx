import React, {useState} from "react";
import "./styles.scss";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/FormBuilder/Checkbox";
import {useTranslations} from "next-intl";

type NDAPropsType = {
    handleSignNDA: ()=>void;
}

const NDA: React.FC<NDAPropsType> = ({handleSignNDA}) => {
    const t = useTranslations('LeadPage.approvedLeadInfo.nda');

    const [isConfirmed, setIsConfirmed] = useState(false);

    return (
        <div className={`lead-page__prices--NDA`}>
            <div className={`card lead-page__prices--NDA-text has-scroll`}>
                <p className='title-h4'>{t('ndaTitle')}</p>
                <p>{t('ndaText')}</p>
                <div className='lead-page__prices--NDA-confirm-checkbox'>
                    <Checkbox name='ndaConfirmed' label={t('ndaCheckbox')} value={isConfirmed} onChange={(val: React.ChangeEvent<HTMLInputElement>)=>setIsConfirmed(val.target.checked)} />
                </div>
            </div>
            <Button classNames='lead-page__prices--NDA-confirm-btn' disabled={!isConfirmed} onClick={() => {handleSignNDA()}}>{t('signNdaBtn')}</Button>
        </div>
    );
};

export default NDA;
