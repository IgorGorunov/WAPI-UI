import React from "react";
import { CODIndicatorType } from "@/types/codReports";
import styles from "./styles.module.scss";
import getSymbolFromCurrency from "currency-symbol-map";

type IndicatorsIfoCartPropsType = {
    title: string;
    type: string;
    indicatorsArray: CODIndicatorType[];
    cardIcons?: boolean;
    classNames?: string;
};

const IndicatorsInfoCard: React.FC<IndicatorsIfoCartPropsType> = (props) => {
    const {
        title,
        type,
        indicatorsArray,
        classNames,
    } = props;

    const Formatter = Intl.NumberFormat();
    const formatAmount = (amount: number, currency: string) => {
        const currencySymbol = getSymbolFromCurrency(currency) || '';
        const currentAmount = Formatter.format(amount).replaceAll(",", ".");
        return `${currencySymbol} ${currentAmount}`;
    }

    return (
        <div
            className={`card ${styles['indicator-info-card']} ${styles[type] || ''} ${classNames ? classNames : ''}`}
        >
            <div className={styles['indicator-info-card__wrapper']}>
                <h4 className={styles.title}>{title}</h4>
                <ul className={styles['indicator-info-card__list']}>
                    {indicatorsArray && indicatorsArray.length ? (
                        indicatorsArray.map((item, index) => (<li key={item.currency+"_"+index} className={styles['indicator-info-card__list-item']}>{formatAmount(item[type], item.currency)}</li>))
                    ): (<li className={styles['indicator-info-card__list-item']}>0</li>)}
                </ul>
            </div>

        </div>
    );
};

export default IndicatorsInfoCard;
