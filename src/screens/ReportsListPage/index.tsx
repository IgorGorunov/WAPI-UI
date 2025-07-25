import React, {useEffect} from "react";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import "./styles.scss";

import ReportsBlock from "@/screens/ReportsListPage/ReportComponents/ReportsBlock";
import {reportBlocks} from "@/screens/ReportsListPage/reports.constants";
import SeoHead from "@/components/SeoHead";
// import SubmenuSingleItem from "@/components/Navigation/SubmenuSingleItem";
// import SubmenuBlock from "@/components/Navigation/SubmenuBlock";
import {ReportsListBlockType} from "@/types/reports";

const ReportsListPage:React.FC = () => {
    const Router = useRouter();
    const { token, isNavItemAccessible } = useAuth();

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, []);

    const isReportSectionAccessible = (reportBlock: ReportsListBlockType) => {
        let isAccessible = false;
        reportBlock.blockReports.forEach(item => {
            if (isNavItemAccessible(item.reportName)) isAccessible = true;
        });
        return isAccessible;
    }

    return (
        <Layout hasFooter>
            <SeoHead title='Report list' description='Our report list page' />
            <div className="page-container reports-list-page__container">
                <Header pageTitle='Reports' toRight >

                </Header>

                <div className='reports-list'>
                    {reportBlocks.map((item, index) =>
                        isReportSectionAccessible(item) ? <div key={`${item.blockTitle}__${index}`} className='report-list__item'>
                            <ReportsBlock {...item} />
                        </div> : null
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default ReportsListPage;