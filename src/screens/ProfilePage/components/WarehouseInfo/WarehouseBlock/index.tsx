import React from "react";

import "./styles.scss";
import {WarehouseInfoType} from "@/types/profile";


type WarehouseBlockPropsType = {
    warehouseData: WarehouseInfoType;
}
const WarehouseBlock: React.FC<WarehouseBlockPropsType> = ({warehouseData}) => {

    return (
        <div className={`warehouse-block  card`}>
            <p className='warehouse-block__warehouse'>
               <span className={`fi fi-${warehouseData.Country.toLowerCase()} flag-icon warehouse-block__flag`}></span>
                <span className='warehouse-block__name'>{warehouseData.Code}</span>
            </p>
            <div className='warehouse-block__info-wrapper'>
                <div className='warehouse-block__card-wrapper'>
                    <div className='warehouse-block__card card'>
                        <p className='warehouse-block__card-title'>Address: </p>
                        <p className='warehouse-blick__card-text'>{warehouseData.Address}</p>
                    </div>
                </div>
                <div className='warehouse-block__card-wrapper'>
                    <div className='warehouse-block__card card'>
                        <p className='warehouse-block__card-title'>Additional info: </p>
                        <p className='warehouse-blick__card-text'>{warehouseData.InfoForClients}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WarehouseBlock;
