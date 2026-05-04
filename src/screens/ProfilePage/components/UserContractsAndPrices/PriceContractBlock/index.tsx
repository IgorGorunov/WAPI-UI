import React from "react";

import styles from "./styles.module.scss";
import {UserContractType, UserPriceType} from "@/types/profile";
import SinglePriceFile from "@/screens/ProfilePage/components/UserContractsAndPrices/SinglePriceFile";

export enum ContractPriceBlockType {
    CONTRACT = 'Contracts',
    PRICE = 'Prices',
}

type ContractPriceBlockPropsType = {
    list: UserPriceType[] | UserContractType[];
    type: ContractPriceBlockType;
}

const PriceContractBlock: React.FC<ContractPriceBlockPropsType> = ({list, type}) => {

    return (
        <div className={`${styles['contracts-and-prices__block']} ${type.toLowerCase()}`}>
            <ul className={styles["contracts-and-prices__block-list"]}>
                {list && list.length ? list.map((file, index) => (
                    <li
                        key={file.name + "_" + index}
                        className={`${styles['contracts-and-prices__block-list-item']} ${
                            index % 2 === 1 ? styles["highlight"] : " "
                        }`}
                    >
                       <SinglePriceFile file={file} type={type}/>
                    </li>
                )) : <p>No {type===ContractPriceBlockType.PRICE ? 'prices' : 'contracts'} to view</p>}
            </ul>
        </div>
    );
};

export default PriceContractBlock;