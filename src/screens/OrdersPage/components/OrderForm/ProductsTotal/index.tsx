import React from "react";
import {OrderProductWithTotalInfoType} from '@/types/orders';
import styles from "./styles.module.scss";

type PropsType = {
    productsInfo?: OrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {

    return (
        <div className={styles["order-products-total"]}>
           <ul className={styles['order-products-total__list']}>
               <li className={`${styles['order-products-total__list-item']} ${Math.round(productsInfo.weightGross*1000)/1000 > 30 ? styles['is-error'] : ''}`}>Weight total gross, kg :<span className={styles['order-products-total__list-item__value']}>{Math.round(productsInfo.weightGross*1000)/1000}</span></li>
               <li className={styles['order-products-total__list-item']}>Weight total net, kg :<span className={styles['order-products-total__list-item__value']}>{Math.round(productsInfo.weightNet*1000)/1000}</span></li>
               <li className={`${styles['order-products-total__list-item']} ${productsInfo.volumeWeight ? Math.round(productsInfo.volumeWeight * 1000) / 1000 : 0 ? styles['is-error'] : ''}`}>Volume weight, kg :<span
                   className={styles['order-products-total__list-item__value']}>{productsInfo.volumeWeight ? Math.round(productsInfo.volumeWeight * 1000) / 1000 : 0}</span>
               </li>
               <li className={styles['order-products-total__list-item']}>Volume, m3 :<span
                   className={styles['order-products-total__list-item__value']}>{Math.round(productsInfo.volume * 1000) / 1000}</span>
               </li>
               <li className={styles['order-products-total__list-item']}>COD :<span
                   className={styles['order-products-total__list-item__value']}>{Math.round(productsInfo.cod * 100) / 100}</span><span
                   className={styles['currency']}>{productsInfo.currency ? productsInfo.currency : ''}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
