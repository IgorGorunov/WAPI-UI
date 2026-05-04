import React from 'react';
import {UserContractType, UserPriceType} from "@/types/profile";
import styles from './styles.module.scss';
import PriceContractBlock, {
    ContractPriceBlockType
} from "@/screens/ProfilePage/components/UserContractsAndPrices/PriceContractBlock";

type UserPricesPropsType = {
    prices: UserPriceType[] | null;
    contracts: UserContractType[] | null;
}

const UserContractsAndPrices: React.FC<UserPricesPropsType> = ({prices, contracts}) => {
    if (!prices && !contracts) {
        return null;
    }

    return (
        <div className={styles['contracts-and-prices']}>
            <p className={`title-h4 ${styles['title-h4']}`}>Contracts</p>
            <PriceContractBlock list={contracts} type={ContractPriceBlockType.CONTRACT}/>
            <p className={`title-h4 ${styles['title-h4']} ${styles['mt-m']}`}>Prices</p>
            <PriceContractBlock list={prices} type={ContractPriceBlockType.PRICE}/>
        </div>
    )
}

export default UserContractsAndPrices;