import React from "react";

import styles from "./styles.module.scss";
import {WarehouseInfoType} from "@/types/profile";
import WarehouseBlock from "./WarehouseBlock";


type WarehouseInfoPropsType = {
    warehouseInfoData: WarehouseInfoType[] | null;
}
const WarehouseInfo: React.FC<WarehouseInfoPropsType> = ({warehouseInfoData}) => {
    return (
        <div className={styles['warehouse-info']}>
            {warehouseInfoData && warehouseInfoData.length ?
                <ul className={styles['warehouse-info__list']}>
                    {warehouseInfoData.map((item, index)=> <li key={item.Code + '_' + index} className={styles['warehouse-info__list-item']}>
                        <WarehouseBlock warehouseData={item} />
                    </li>)}
                </ul>
                : <p className={styles['no-info']}>There is no available warehouse info.</p>}
        </div>
    );
};

export default WarehouseInfo;
