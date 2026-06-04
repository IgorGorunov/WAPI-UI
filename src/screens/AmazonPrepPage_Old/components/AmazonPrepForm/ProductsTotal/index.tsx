import React from "react";
import "./styles.scss";
import {AmazonPrepOrderProductWithTotalInfoType} from "@/types/amazonPrep";

type PropsType = {
    productsInfo?: AmazonPrepOrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {

    return (
        <div className="amazon-prep-products-total">
           <ul className='amazon-prep-products-total__list'>
               <li className='amazon-prep-products-total__list-item'>Weight total gross, kg :<span className='amazon-prep-products-total__list-item__value'>{Math.round(productsInfo.weightGross*1000)/1000}</span></li>
               <li className='amazon-prep-products-total__list-item'>Weight total net, kg :<span className='amazon-prep-products-total__list-item__value'>{Math.round(productsInfo.weightNet*1000)/1000}</span></li>
               <li className='amazon-prep-products-total__list-item'>Volume, m3 :<span className='amazon-prep-products-total__list-item__value'>{Math.round(productsInfo.volume*1000)/1000}</span></li>
               <li className='amazon-prep-products-total__list-item'>Pallets :<span className='amazon-prep-products-total__list-item__value'>{Math.round(0)}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
