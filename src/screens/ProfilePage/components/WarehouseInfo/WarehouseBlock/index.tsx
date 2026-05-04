import React from "react";

import styles from "./styles.module.scss";
import {WarehouseInfoType} from "@/types/profile";


type WarehouseBlockPropsType = {
    warehouseData: WarehouseInfoType;
}
const WarehouseBlock: React.FC<WarehouseBlockPropsType> = ({warehouseData}) => {

    return (
        <div className={`${styles['warehouse-block']} card`}>
            <p className={styles['warehouse-block__warehouse']}>
               <span className={`fi fi-${warehouseData.Country.toLowerCase()} flag-icon ${styles['warehouse-block__flag']}`}></span>
                <span className={styles['warehouse-block__name']}>{warehouseData.Code}</span>
            </p>
            <div className={styles['warehouse-block__info-wrapper']}>
                <div className={styles['warehouse-block__card-wrapper']}>
                    <div className={`${styles['warehouse-block__card']} card`}>
                        <p className={styles['warehouse-block__card-title']}>Address: </p>
                        <p className={styles['warehouse-block__card-text']}>{warehouseData.Address}</p>
                    </div>
                </div>
                <div className={styles['warehouse-block__card-wrapper']}>
                    <div className={`${styles['warehouse-block__card']} card`}>
                        <p className={styles['warehouse-block__card-title']}>Additional info: </p>
                        <p className={styles['warehouse-block__card-text']}>{warehouseData.InfoForClients}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WarehouseBlock;
