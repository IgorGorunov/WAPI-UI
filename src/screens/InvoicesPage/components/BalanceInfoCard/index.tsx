import React from "react";
import { BalanceInfoType } from "@/types/invoices";
import {CURRENCY_SYMBOLS} from "@/constants/currency";
import "./styles.scss";

type BalanceIfoCartPropsType = {
    title: string;
    type: string;
    balanceArray: BalanceInfoType[];
};

const BalanceInfoCard: React.FC<BalanceIfoCartPropsType> = (props) => {
    const {
        title,
        type,
        balanceArray
    } = props;

    const isOverdue = type === "overdue";
    const Formatter = Intl.NumberFormat();
    const formatAmount = (amount: number, currency: string) => {
        const currencySymbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || '';
        const debtAmount = Formatter.format(amount).replaceAll(",", " ");

        console.log("123", amount, currency);
        return `${currencySymbol} ${debtAmount}`;
    }

    console.log("props",props);

    return (
        <div
            className={`card balance-info-card ${isOverdue ? "overdue" : ""}`}
        >
            <div className="balance-info-card__wrapper">
                <h4 className="title">{title}</h4>

                <ul className="balance-info-card__list">
                    {balanceArray && balanceArray.length ? (
                        balanceArray.map((item, index) => (<li key={item.currency+"_"+index} className='balance-info-card__list-item'>{formatAmount(item[type], item.currency)}</li>))
                    ): (<li className='balance-info-card__list-item'>0</li>)}
                </ul>
            </div>
        </div>
    );
};

export default BalanceInfoCard;
