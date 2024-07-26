import React, {useEffect, useMemo} from "react";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import "./styles.scss";

import ReportsBlock from "@/screens/ReportsListPage/ReportComponents/ReportsBlock";
import {reportBlocks as reportBlocksFn} from "@/screens/ReportsListPage/reports.constants";
import {useTranslations} from "next-intl";

const ReportsListPage:React.FC = () => {
    const t = useTranslations('Reports');

    const Router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) Router.push(Routes.Login);
    }, []);

    const reportBlocks = useMemo(()=>reportBlocksFn(t), [Router.locale]);

    return (
        <Layout hasFooter>
            <div className="page-container reports-list-page__container">
                <Header pageTitle={t('headerTitle')} toRight />

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