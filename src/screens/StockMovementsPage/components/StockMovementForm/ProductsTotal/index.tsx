import React from "react";
import styles from "./styles.module.scss";

type PropsType = {
    weightGross: number;
    weightNet: number;
    volume: number;
    palletAmount: number;
    packages: number;
};

const ProductsTotal: React.FC<PropsType> = ({ weightGross=0, weightNet=0,volume=0,palletAmount =0, packages=0 }) => {

    return (
        <div className={styles["stock-movement-total"]}>
           <ul className={styles['stock-movement-total__list']}>
               {weightGross ? <li key='weightGross' className={styles['stock-movement-total__list-item']}>Weight total gross, kg :<span className={styles['stock-movement-total__list-item__value']}>{weightGross}</span></li> : null}
               {weightNet ? <li key='weightNet' className={styles['stock-movement-total__list-item']}>Weight total net, kg :<span className={styles['stock-movement-total__list-item__value']}>{weightNet}</span></li> : null}
               {volume ? <li key='volume' className={styles['stock-movement-total__list-item']}>Volume, m3 :<span className={styles['stock-movement-total__list-item__value']}>{volume}</span></li> : null}
               {palletAmount ? <li key='palletAmount'  className={styles['stock-movement-total__list-item']}>Pallets :<span className={styles['stock-movement-total__list-item__value']}>{palletAmount}</span></li> : null}
               {packages ? <li key='packages'  className={styles['stock-movement-total__list-item']}>Cartons :<span className={styles['stock-movement-total__list-item__value']}>{packages}</span></li> : null}
           </ul>
        </div>
    );
};

export default ProductsTotal;
