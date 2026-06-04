import React from "react";
import {PalletType} from "@/types/amazonPrep";
import styles from "./styles.module.scss";

type PropsType = {
    pallets?: PalletType[];
};

const Pallets: React.FC<PropsType> = ({ pallets }) => {
    
    return (
        <div className={styles["amazon-prep-pallets"]}>
            <div className={styles["amazon-prep-pallets__header"]}>
                <div className={`${styles['column']} ${styles['name-column']}`}>Name</div>
                <div className={`${styles['column']} ${styles['width-column']}`}>Width</div>
                <div className={`${styles['column']} ${styles['length-column']}`}>Length</div>
                <div className={`${styles['column']} ${styles['height-column']}`}>Height</div>
                <div className={`${styles['column']} ${styles['weight-column']}`}>Weight</div>
                <div className={`${styles['column']} ${styles['volume-column']}`}>Volume</div>
                <div className={`${styles['column']} ${styles['tracking-number-column']}`}>Tracking number</div>
            </div>
            <ul className={styles["order-service-history__list"]}>
                {pallets &&
                    pallets.map((pallet: PalletType, index: number) => (
                        <li
                            key={pallet.palletName + "_" + index}
                            className={`${styles["order-service__list-item"]} ${
                                index % 2 === 1 ? styles["highlight"] : " "
                            }`}
                        >
                            <div className={styles['name-column']}>{pallet.palletName}</div>
                            <div className={`${styles['column']} ${styles['width-column']}`}>{pallet.palletWidth}</div>
                            <div className={`${styles['column']} ${styles['length-column']}`}>{pallet.palletLength}</div>
                            <div className={`${styles['column']} ${styles['height-column']}`}>{pallet.palletHeight}</div>
                            <div className={`${styles['column']} ${styles['weight-column']}`}>{pallet.palletWeight}</div>
                            <div className={`${styles['column']} ${styles['volume-column']}`}>{pallet.palletVolume}</div>
                            <div className={`${styles['column']} ${styles['tracking-number-column']}`}>{pallet.palletTrackingNumber}</div>
                        </li>
                    ))}
            </ul>

        </div>
    );
};

export default Pallets;
