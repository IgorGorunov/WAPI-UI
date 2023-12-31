import React from "react";
import {PalletType} from "@/types/amazonPrep";
import "./styles.scss";

type PropsType = {
    pallets?: PalletType[];
};

const Pallets: React.FC<PropsType> = ({ pallets }) => {
    
    return (
        <div className="amazon-prep-pallets">
            <div className="amazon-prep-pallets__header">
                <div className='column name-column'>Name</div>
                <div className='column width-column'>Width</div>
                <div className='column length-column'>Length</div>
                <div className='column height-column'>Height</div>
                <div className='column weight-column'>Weight</div>
                <div className='column volume-column'>Volume</div>
                <div className='column tracking-number-column'>Tracking number</div>
            </div>
            <ul className="order-service-history__list">
                {pallets &&
                    pallets.map((pallet: PalletType, index: number) => (
                        <li
                            key={pallet.palletName + "_" + index}
                            className={`order-service__list-item ${
                                index % 2 === 1 ? "highlight" : " "
                            }`}
                        >
                            <div className='name-column'>{pallet.palletName}</div>
                            <div className='column width-column'>{pallet.palletWidth}</div>
                            <div className='column length-column'>{pallet.palletLength}</div>
                            <div className='column height-column'>{pallet.palletHeight}</div>
                            <div className='column weight-column'>{pallet.palletWeight}</div>
                            <div className='column volume-column'>{pallet.palletVolume}</div>
                            <div className='column tracking-number-column'>{pallet.palletTrackingNumber}</div>
                        </li>
                    ))}
            </ul>

        </div>
    );
};

export default Pallets;
