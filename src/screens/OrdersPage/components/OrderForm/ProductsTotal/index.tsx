import React, {useCallback} from "react";
import {OrderProductWithTotalInfoType} from '@/types/orders';
import "./styles.scss";

type PropsType = {
    productsInfo?: OrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {

    return (
        <div className="order-products-total">
           <ul className='order-products-total__list'>
               <li className='order-products-total__list-item'>Weight total gross, kg :<span className='order-products-total__list-item__value'>{productsInfo.weightGross}</span></li>
               <li className='order-products-total__list-item'>Weight total net, kg :<span className='order-products-total__list-item__value'>{productsInfo.weightNet}</span></li>
               <li className='order-products-total__list-item'>Volume, m3 :<span className='order-products-total__list-item__value'>{productsInfo.volume}</span></li>
               <li className='order-products-total__list-item'>COD :<span className='order-products-total__list-item__value'>{productsInfo.cod}</span><span className='currency'>{productsInfo.currency ? productsInfo.currency : ''}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
