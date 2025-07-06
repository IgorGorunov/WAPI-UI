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

const ReportsListPage:React.FC = () => {
    const Router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, []);

    return (
        <Layout hasFooter>
            <SeoHead title='Report list' description='Our report list page' />
            <div className="page-container reports-list-page__container">
                <Header pageTitle='Reports' toRight >

                </Header>

                <div className='reports-list'>
                    {reportBlocks.map((item, index) =>(
                        <div key={`${item.blockTitle}__${index}`} className='report-list__item'><ReportsBlock {...item} /></div>
                        )
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default ReportsListPage;