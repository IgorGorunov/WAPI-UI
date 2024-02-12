import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import './styles.scss'
import {REPORT_TITLES, ReportsListBlockType} from "@/types/reports";


const ReportsBlock: React.FC<ReportsListBlockType> = ({blockTitle, blockIcon, blockReports}) => {

    return (
        <div className={`reports-block-container card`}>
            <div className="reports-block-header">
                <Icon name={blockIcon} style={{width: "30px", height: "30px"}} />
                <span className='reports-block__title'>{blockTitle}</span>
            </div>
            <div className="reports-block__items grid-row">
                {blockReports.map((reportItem,index) => (
                    <div className='reports-block-item__wrapper  width-33' key={`${REPORT_TITLES[reportItem.reportType]}_${index}`}>
                        <Link  href={reportItem.reportPageLink} className="reports-block-item">
                            {REPORT_TITLES[reportItem.reportType]}
                        </Link>
                    </div>
                )) }
            </div>

        </div>
    )
}

export default ReportsBlock;


