import React from "react";
import {OrderProductWithTotalInfoType} from '@/types/orders';
import "./styles.scss";

type PropsType = {
    productsInfo?: OrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {

    return (
        <div className="order-products-total">
           <ul className='order-products-total__list'>
               <li className='order-products-total__list-item'>Weight total gross, kg :<span className='order-products-total__list-item__value'>{Math.round(productsInfo.weightGross*1000)/1000}</span></li>
               <li className='order-products-total__list-item'>Weight total net, kg :<span className='order-products-total__list-item__value'>{Math.round(productsInfo.weightNet*1000)/1000}</span></li>
               <li className='order-products-total__list-item'>Volume, m3 :<span className='order-products-total__list-item__value'>{Math.round(productsInfo.volume*1000)/1000}</span></li>
               <li className='order-products-total__list-item'>Volume weight, kg :<span
                   className='order-products-total__list-item__value'>{productsInfo.volumeWeight ? Math.round(productsInfo.volumeWeight * 1000) / 1000 : 0}</span>
               </li>
               <li className='order-products-total__list-item'>COD :<span
                   className='order-products-total__list-item__value'>{Math.round(productsInfo.cod * 100) / 100}</span><span
                   className='currency'>{productsInfo.currency ? productsInfo.currency : ''}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
