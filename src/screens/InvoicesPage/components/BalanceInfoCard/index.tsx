import React from "react";
import { BalanceInfoType } from "@/types/invoices";
import "./styles.scss";
import getSymbolFromCurrency from "currency-symbol-map";
import Icon from "@/components/Icon";

type BalanceIfoCartPropsType = {
    title: string;
    type: string;
    balanceArray: BalanceInfoType[];
    cardIcons?: boolean;
};

const BalanceInfoCard: React.FC<BalanceIfoCartPropsType> = (props) => {
    const {
        title,
        type,
        balanceArray,
        cardIcons = false,
    } = props;

    //const isOverdue = type === "overdue";
    const Formatter = Intl.NumberFormat();
    const formatAmount = (amount: number, currency: string) => {
        const currencySymbol = getSymbolFromCurrency(currency) || '';
        const debtAmount = Formatter.format(amount).replaceAll(",", ".");

        return `${currencySymbol} ${debtAmount}`;
    }



    return (
        <div
            className={`card balance-info-card ${type} ${cardIcons ? 'has-cards' : ''}`}
        >
            <div className="balance-info-card__wrapper">
                <h4 className="title">{title}</h4>

                <ul className="balance-info-card__list">
                    {balanceArray && balanceArray.length ? (
                        balanceArray.map((item, index) => (<li key={item.currency+"_"+index} className='balance-info-card__list-item'>{formatAmount(item[type], item.currency)}</li>))
                    ): (<li className='balance-info-card__list-item'>0</li>)}
                </ul>
            </div>
            {cardIcons && (<ul className='payment-cards-icons__list'>
                <li key={'mastercard'} className='payment-cards-icons__list-item'><Icon name='mastercard' /></li>
                <li key={'visa'} className='payment-cards-icons__list-item'><Icon name='visa' /></li>
                <li key={'paypal'} className='payment-cards-icons__list-item'><Icon name='paypal' /></li>
            </ul>)}
        </div>
    );
};

export default BalanceInfoCard;
