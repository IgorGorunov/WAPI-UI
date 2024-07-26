import React from "react";
import "./styles.scss";
import {AmazonPrepOrderProductWithTotalInfoType} from "@/types/amazonPrep";
import {useTranslations} from "next-intl";

type PropsType = {
    productsInfo?: AmazonPrepOrderProductWithTotalInfoType;
};

const ProductsTotal: React.FC<PropsType> = ({ productsInfo }) => {
    const t = useTranslations('AmazonPrep.amazonColumns.productsTotal');
    return (
        <div className="amazon-prep-products-total">
           <ul className='amazon-prep-products-total__list'>
               <li className='amazon-prep-products-total__list-item'>{t('weightTotalGross')} :<span className='amazon-prep-products-total__list-item__value'>{Math.round(productsInfo.weightGross*1000)/1000}</span></li>
               <li className='amazon-prep-products-total__list-item'>{t('weightTotalNet')} :<span className='amazon-prep-products-total__list-item__value'>{Math.round(productsInfo.weightNet*1000)/1000}</span></li>
               <li className='amazon-prep-products-total__list-item'>{t('volumeTotal')} :<span className='amazon-prep-products-total__list-item__value'>{Math.round(productsInfo.volume*1000)/1000}</span></li>
               <li className='amazon-prep-products-total__list-item'>{t('palletsTotal')} :<span className='amazon-prep-products-total__list-item__value'>{Math.round(0)}</span></li>

           </ul>
        </div>
    );
};

export default ProductsTotal;
