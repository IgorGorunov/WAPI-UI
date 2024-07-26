import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import './styles.scss'
import {REPORT_TITLES, ReportsListBlockType} from "@/types/reports";
import useAuth from "@/context/authContext";
import {useTranslations} from "next-intl";


const ReportsBlock: React.FC<ReportsListBlockType> = ({blockTitle, blockIcon, blockReports}) => {
    const t = useTranslations('Reports.reportTitles');
    const {isNavItemAccessible} = useAuth();
    return (
        <div className={`reports-block-container card`}>
            <div className="reports-block-header">
                <Icon name={blockIcon} style={{width: "30px", height: "30px"}} />
                <span className='reports-block__title'>{blockTitle}</span>
            </div>
            <div className="reports-block__items grid-row">
                {blockReports.map((reportItem,index) => (
                    isNavItemAccessible(reportItem.reportName) ? <div className='reports-block-item__wrapper  width-33' key={`${REPORT_TITLES[reportItem.reportType]}_${index}`}>
                        <Link  href={reportItem.reportPageLink} className="reports-block-item">
                            {t(reportItem.reportType)}
                        </Link>
                        {reportItem.reportDescription ? <div className="reports-block-item__description">
                            {reportItem.reportDescription}
                        </div> : null}
                    </div> : null
                )) }
            </div>

        </div>
    )
}

export default ReportsBlock;


