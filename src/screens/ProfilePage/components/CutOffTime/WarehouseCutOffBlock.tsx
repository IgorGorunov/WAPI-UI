import React from "react";
import styles from "./styles.module.scss";
import {CutOffDataType} from "@/types/profile";


type WarehouseBlockPropsType = {
    warehouseCutoffs: CutOffDataType[];
}

const formatTime = (timeStr: string) => {
    // return timeStr.slice(0, -3)
    return timeStr.split(':').length === 3
        ? timeStr.substring(0, timeStr.lastIndexOf(':'))
        : timeStr;

}

const WarehouseCutOffBlock: React.FC<WarehouseBlockPropsType> = ({warehouseCutoffs}) => {
    if (!warehouseCutoffs || warehouseCutoffs.length == 0) return null;

    const warehouse = warehouseCutoffs[0];

    return (
        <div className={`${styles['cutoff-times__warehouse']} card`}>
            <p className={styles['cutoff-times__warehouse-title']}>
                <span className={`fi fi-${warehouse.warehouse.country.toLowerCase()} flag-icon ${styles['cutoff-times__warehouse-flag']}`}></span>
                <span className={styles['cutoff-times__warehouse-name']}>{warehouse.warehouse.name}</span>
                <span className={`${styles['cutoff-times__warehouse-open-from']}`}>(opens at {formatTime(warehouse.workingTimeBegin)} local time)</span>
            </p>

            <div className={`${styles['cutoff-times__container']} card`}>
                <table className={styles['cutoff-times__table']}>
                    <thead>
                        <tr>
                            <th>Courier service</th>
                            <th>Cutoff time (UTC)</th>
                            <th>Time zone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouseCutoffs.sort((a, b) => a.courierService.name < b.courierService.name ? -1 : 1).map(item => (
                            <tr key={item.courierService.id}>
                                <td className={styles['cutoff-times__courier-name']}>{item.courierService.name}</td>
                                <td>{formatTime(item.cutOffTime)}</td>
                                <td><span className={styles['smaller']}>GMT{item.timeZone}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarehouseCutOffBlock;
