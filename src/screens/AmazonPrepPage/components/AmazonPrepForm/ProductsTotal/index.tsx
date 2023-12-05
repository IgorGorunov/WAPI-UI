import React from "react";
import {OrderProductWithTotalInfoType} from '@/types/orders';
import "./styles.scss";

type PropsType = {
    productsInfo?: OrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {

    return (
        <div className="amazon-prep-products-total">
           <ul className='amazon-prep-products-total__list'>
               <li className='amazon-prep-products-total__list-item'>Weight total gross, kg :<span className='amazon-prep-products-total__list-item__value'>{productsInfo.weightGross}</span></li>
               <li className='amazon-prep-products-total__list-item'>Weight total net, kg :<span className='amazon-prep-products-total__list-item__value'>{productsInfo.weightNet}</span></li>
               <li className='amazon-prep-products-total__list-item'>Volume, m3 :<span className='amazon-prep-products-total__list-item__value'>{productsInfo.volume}</span></li>
               <li className='amazon-prep-products-total__list-item'>COD :<span className='amazon-prep-products-total__list-item__value'>{productsInfo.cod}</span><span className='currency'>{productsInfo.currency ? productsInfo.currency : ''}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
