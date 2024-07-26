import React from "react";

import "./styles.scss";
import {UserContractType, UserPriceType} from "@/types/profile";
import SinglePriceFile from "@/screens/ProfilePage/components/UserContractsAndPrices/SinglePriceFile";
import {useTranslations} from "next-intl";

export enum ContractPriceBlockType {
    CONTRACT = 'Contracts',
    PRICE = 'Prices',
}

type ContractPriceBlockPropsType = {
    list: UserPriceType[] | UserContractType[];
    type: ContractPriceBlockType;
}

const PriceContractBlock: React.FC<ContractPriceBlockPropsType> = ({list, type}) => {
    const t = useTranslations('Profile.contractsAndPricesTab');
    return (
        <div className={`contracts-and-prices__block ${type.toLowerCase()}`}>
            <ul className="contracts-and-prices__block-list">
                {list && list.length ? list.map((file, index) => (
                    <li
                        key={file.name + "_" + index}
                        className={`contracts-and-prices__block-list-item ${
                            index % 2 === 1 ? "highlight" : " "
                        }`}
                    >
                       <SinglePriceFile file={file} type={type}/>
                    </li>
                )) : <p>{type === ContractPriceBlockType.PRICE ? t('noPricesText') : t('noContractsText')}</p>}
            </ul>
        </div>
    );
};

export default PriceContractBlock;