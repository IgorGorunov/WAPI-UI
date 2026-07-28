import React, {memo} from "react";
import styles from "./styles.module.scss";
import WarehouseCutOffBlock from "./WarehouseCutOffBlock";
import {CutOffDataType} from "@/types/profile";


type WarehouseInfoPropsType = {
    cutoffTimes: CutOffDataType[] | null;
}
const WarehouseInfo: React.FC<WarehouseInfoPropsType> = ({cutoffTimes}) => {
    const warehouses = Array.from(new Set(cutoffTimes.map(item => item.warehouse.name).sort((a, b) => a < b ? -1 : 1)));

    return (
        <div className={styles['cutoff-times']}>
            {warehouses && warehouses.length ?
                <ul className={styles['cutoff-times__list']}>
                    {warehouses.map((warehouse, index)=> (
                        <li key={warehouse + '_' + index} className={styles['cutoff-times__list-item']}>
                            {/*<div className={`${styles['cutoff-times__warehouse']} card`}>*/}
                            {/*    <p className={styles['cutoff-times__warehouse-title']}>*/}
                            {/*        <span className={`fi fi-${warehouse.country.toLowerCase()} flag-icon ${styles['cutoff-times__warehouse-flag']}`}></span>*/}
                            {/*        <span className={styles['cutoff-times__warehouse-name']}>{warehouse.name}</span>*/}
                            {/*        <span className={`${styles['cutoff-times__warehouse-open-from']}`}>(opens at {warehouse.openFrom})</span>*/}
                            {/*    </p>*/}
                                <WarehouseCutOffBlock warehouseCutoffs={cutoffTimes.filter(item => item.warehouse.name === warehouse)} />
                            {/*</div>*/}
                        </li>
                    ))}
                </ul>
                : <p className={styles['no-info']}>There is no available cutoff info.</p>}
        </div>
    );
};

export default memo(WarehouseInfo);
