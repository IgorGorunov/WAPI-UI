import React from "react";
import { CODIndicatorType } from "@/types/codReports";
import "./styles.scss";
import getSymbolFromCurrency from "currency-symbol-map";

type IndicatorsIfoCartPropsType = {
    title: string;
    type: string;
    indicatorsArray: CODIndicatorType[];
    cardIcons?: boolean;
};

const IndicatorsInfoCard: React.FC<IndicatorsIfoCartPropsType> = (props) => {
    const {
        title,
        type,
        indicatorsArray,
    } = props;

    const Formatter = Intl.NumberFormat();
    const formatAmount = (amount: number, currency: string) => {
        const currencySymbol = getSymbolFromCurrency(currency) || '';
        const currentAmount = Formatter.format(amount).replaceAll(",", ".");
        return `${currencySymbol} ${currentAmount}`;
    }

    return (
        <div
            className={`card indicator-info-card ${type}`}
        >
            <div className="indicator-info-card__wrapper">
                <h4 className="title">{title}</h4>
                <ul className="indicator-info-card__list">
                    {indicatorsArray && indicatorsArray.length ? (
                        indicatorsArray.map((item, index) => (<li key={item.currency+"_"+index} className='indicator-info-card__list-item'>{formatAmount(item[type], item.currency)}</li>))
                    ): (<li className='indicator-info-card__list-item'>0</li>)}
                </ul>
            </div>

        </div>
    );
};

export default IndicatorsInfoCard;
