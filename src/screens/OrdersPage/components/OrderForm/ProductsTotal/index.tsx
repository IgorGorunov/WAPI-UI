import React from "react";
import {OrderProductWithTotalInfoType} from '@/types/orders';
import "./styles.scss";
import {useTranslations} from "next-intl";

type PropsType = {
    productsInfo?: OrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {
    const t = useTranslations('Fulfillment.orderTabsInfo.products');
    return (
        <div className="order-products-total">
           <ul className='order-products-total__list'>
               <li className='order-products-total__list-item'>{t('weightTotalGross')} :<span className='order-products-total__list-item__value'>{Math.round(productsInfo.weightGross*1000)/1000}</span></li>
               <li className='order-products-total__list-item'>{t('weightTotalNet')} :<span className='order-products-total__list-item__value'>{Math.round(productsInfo.weightNet*1000)/1000}</span></li>
               <li className='order-products-total__list-item'>{t('volumeWeightTotal')} :<span
                   className='order-products-total__list-item__value'>{productsInfo.volumeWeight ? Math.round(productsInfo.volumeWeight * 1000) / 1000 : 0}</span>
               </li>
               <li className='order-products-total__list-item'>{t('volumeTotal')} :<span
                   className='order-products-total__list-item__value'>{Math.round(productsInfo.volume * 1000) / 1000}</span>
               </li>
               <li className='order-products-total__list-item'>{t('cod')} :<span
                   className='order-products-total__list-item__value'>{Math.round(productsInfo.cod * 100) / 100}</span><span
                   className='currency'>{productsInfo.currency ? productsInfo.currency : ''}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
