import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import styles from './styles.module.scss'
import {REPORT_TITLES, ReportsListBlockType} from "@/types/reports";
import useAuth from "@/context/authContext";


const ReportsBlock: React.FC<ReportsListBlockType> = ({blockTitle, blockIcon, blockReports}) => {
    const {isNavItemAccessible} = useAuth();
    return (
        <div className={`${styles['reports-block-container']} card`}>
            <div className={styles["reports-block-header"]}>
                <Icon name={blockIcon} style={{width: "30px", height: "30px"}} />
                <span className='reports-block__title'>{blockTitle}</span>
            </div>
            <div className={`${styles["reports-block__items"]} grid-row`}>
                {blockReports.map((reportItem,index) => (
                    isNavItemAccessible(reportItem.reportName) ? <div className={`${styles['reports-block-item__wrapper']} width-33`} key={`${REPORT_TITLES[reportItem.reportType]}_${index}`}>
                        <Link  href={reportItem.reportPageLink} className={styles["reports-block-item"]}>
                            {REPORT_TITLES[reportItem.reportType]}
                        </Link>
                        {reportItem.reportDescription ? <div className={styles["reports-block-item__description"]}>
                            {reportItem.reportDescription}
                        </div> : null}
                    </div> : null
                )) }
            </div>

        </div>
    )
}

export default ReportsBlock;


