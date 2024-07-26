import React from "react";
import "./styles.scss";
import {useTranslations} from "next-intl";

type PropsType = {
    weightGross: number;
    weightNet: number;
    volume: number;
    palletAmount: number;
    packages: number;
};

const ProductsTotal: React.FC<PropsType> = ({ weightGross=0, weightNet=0,volume=0,palletAmount =0, packages=0 }) => {
    const t = useTranslations('StockMovements.docColumns.productsTotal');
    return (
        <div className="stock-movement-total">
           <ul className='stock-movement-total__list'>
               {weightGross ? <li key='weightGross' className='stock-movement-total__list-item'>{t('weightTotalGross')} :<span className='stock-movement-total__list-item__value'>{weightGross}</span></li> : null}
               {weightNet ? <li key='weightNet' className='stock-movement-total__list-item'>{t('weightTotalNet')} :<span className='stock-movement-total__list-item__value'>{weightNet}</span></li> : null}
               {volume ? <li key='volume' className='stock-movement-total__list-item'>{t('volumeTotal')} :<span className='stock-movement__list-item__value'>{volume}</span></li> : null}
               {palletAmount ? <li key='palletAmount'  className='stock-movement-total__list-item'>{t('palletsTotal')} :<span className='stock-movement-total__list-item__value'>{palletAmount}</span></li> : null}
               {packages ? <li key='packages'  className='stock-movement-total__list-item'>{t('packagesTotal')} :<span className='stock-movement-total__list-item__value'>{packages}</span></li> : null}
           </ul>
        </div>
    );
};

export default ProductsTotal;
