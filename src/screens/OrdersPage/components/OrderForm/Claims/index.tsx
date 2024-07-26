import React from "react";
import {ClaimType} from "@/types/orders";
import "./styles.scss";
import Accordion from "@/components/Accordion";
import Claim from "./ClaimItem";
import {formatDateStringToDisplayString} from "@/utils/date";
import {useTranslations} from "next-intl";

type PropsType = {
   claims?: ClaimType[] ;
};

const Claims: React.FC<PropsType> = ({ claims }) => {
    const t = useTranslations('Fulfillment.orderTabsInfo.claims');
    return (
        <div className="order-claims">
            {claims.map(item => (<div key={item.number+item.status} className='claim'> <Accordion title={`${t('claim')} #${item.number} ${t('from')} ${formatDateStringToDisplayString(item.date)}. ${t('status')}: ${item.status}`}><Claim claim={item} /></Accordion></div>))}
        </div>
    );
};

export default Claims;
