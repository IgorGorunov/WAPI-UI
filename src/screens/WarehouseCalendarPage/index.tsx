import React, {useCallback, useEffect, useState} from 'react';
import useTenant from "@/context/tenantContext";
import useAuth from "@/context/authContext";
import {getWarehouseCalendars} from "@/services/warehouseCalendar";
import {WarehouseCalendarType} from "@/types/warehouseCalendar";
import Header from "@/components/Header";
import Layout from "@/components/Layout/Layout";
import WarehouseCalendar from "@/screens/WarehouseCalendarPage/WarehouseCalendar";

const WarehouseCalendarPage = () => {
    const { tenantData } = useTenant();
    const { token, superUser, ui } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [warehouseData, setWarehouseData] = useState<WarehouseCalendarType[] | null>(null);

    const fetchProfileData = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = { token, alias: tenantData?.alias };

            // try {
            //     sendUserBrowserInfo({ ...getBrowserInfo('GetWarehousesList', AccessObjectTypes["Profile/WarehouseInfo"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            // } catch { }
            // if (!isActionIsAccessible(AccessObjectTypes["Profile/WarehouseInfo"], AccessActions.ListView)) {
            //     setWarehouseData(null);
            // } else {
                const resWarehouseInfo = await getWarehouseCalendars(superUser && ui ? { ...requestData, ui } : requestData);
                if (resWarehouseInfo.status === 200) {
                    setWarehouseData(resWarehouseInfo.data);
                }
            // }
        } catch {
            //something went wrong
        } finally {
            setIsLoading(false);
        }
    }, [token, ui]);

    useEffect(() => {
        fetchProfileData();
    }, []);


    return (
        <Layout hasFooter>
            <div className={`page-component warehouse-calendar-page`}>
                <Header pageTitle='Warehouse calendar' toRight  />

                <div className='warehouse-calendar-page__container'>
                    {isLoading && <div className='loader' />}
                    {warehouseData ? <WarehouseCalendar warehouses={warehouseData} /> : null}
                </div>
            </div>
        </Layout>
    );
}

export default WarehouseCalendarPage;