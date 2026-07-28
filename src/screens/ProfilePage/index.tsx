import React, { useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import styles from "./styles.module.scss";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import ProfileInfo from "./components/ProfileInfo";
import ApiProtocols from "./components/ApiProtocols";
import {ApiProtocolType, CutOffDataType, UserContractType, UserPriceType, WarehouseInfoType} from "@/types/profile";
import {getApiProtocols, getCutoffTimes, getUserContracts, getUserPrices, getWarehouseInfo} from "@/services/profile";
import useAuth from "@/context/authContext";
import { AccessActions, AccessObjectTypes, UserInfoType } from "@/types/auth";
import UserContractsAndPrices from "./components/UserContractsAndPrices";
import WarehouseInfo from "@/screens/ProfilePage/components/WarehouseInfo";
import { getUserProfile, sendUserBrowserInfo } from "@/services/userInfo";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import CutOffTime from "@/screens/ProfilePage/components/CutOffTime";

const ProfilePage = () => {
    const { tenantData: { alias } } = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [apiProtocolsData, setApiProtocolsData] = useState<ApiProtocolType[] | null>(null);
    const [pricesData, setPricesData] = useState<UserPriceType[] | null>(null);
    const [contractsData, setContractsData] = useState<UserContractType[] | null>(null);
    const [warehouseInfoData, setWarehouseInfoData] = useState<WarehouseInfoType[] | null>(null);
    const [cutoffTimes, setCutoffTimes] = useState<CutOffDataType[] | null>(null);
    const [profileInfo, setProfileInfo] = useState<UserInfoType | null>(null);

    const fetchProfileData = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = { token, alias };

            // profile info
            const res = await getUserProfile(superUser && ui ? { ...requestData, ui } : requestData);
            if (res.status === 200) {
                setProfileInfo(res.data?.userProfile?.userInfo);
            }

            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetDeliveryProtocols', AccessObjectTypes["Profile/DeliveryProtocols"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            if (!isActionIsAccessible(AccessObjectTypes["Profile/DeliveryProtocols"], AccessActions.ListView)) {
                setApiProtocolsData(null);
            } else {
                const res = await getApiProtocols(superUser && ui ? { ...requestData, ui } : requestData);
                if (res.status === 200) {
                    setApiProtocolsData(res.data);
                }
            }

            // prices
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetClientPriceList', AccessObjectTypes["Profile/Prices"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            if (!isActionIsAccessible(AccessObjectTypes["Profile/Prices"], AccessActions.ListView)) {
                setPricesData(null);
            } else {
                const resPrices = await getUserPrices(superUser && ui ? { ...requestData, ui } : requestData);
                if (resPrices.status === 200) {
                    setPricesData(resPrices.data);
                }
            }

            //contracts
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetContractsList', AccessObjectTypes["Profile/Contracts"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }
            if (!isActionIsAccessible(AccessObjectTypes["Profile/Contracts"], AccessActions.ListView)) {
                setPricesData(null);
            } else {
                const resContracts = await getUserContracts(superUser && ui ? { ...requestData, ui } : requestData);
                if (resContracts.status === 200) {
                    setContractsData(resContracts.data);
                }
            }

            // warehouse info
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetWarehousesList', AccessObjectTypes["Profile/WarehouseInfo"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }
            if (!isActionIsAccessible(AccessObjectTypes["Profile/WarehouseInfo"], AccessActions.ListView)) {
                setWarehouseInfoData(null);
            } else {
                const resWarehouseInfo = await getWarehouseInfo(superUser && ui ? { ...requestData, ui } : requestData);
                if (resWarehouseInfo.status === 200) {
                    setWarehouseInfoData(resWarehouseInfo.data);
                }
            }

            // cutoff time
            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetCutoffTimes', AccessObjectTypes["Profile/CutoffTimes"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }
            if (!isActionIsAccessible(AccessObjectTypes["Profile/CutoffTimes"], AccessActions.ListView)) {
                setWarehouseInfoData(null);
            } else {


            // requestData.token = "46104416-ced0-4d1d-a5d4-7d614e776be1";
                const resCutoffTimes = await getCutoffTimes(superUser && ui ? { ...requestData, ui } : requestData);
                if (resCutoffTimes.status === 200) {
                    setCutoffTimes(resCutoffTimes.data);
                }
            }
        } catch {
            //something went wrong
        } finally {
            setIsLoading(false);
        }
    }, [token, ui]);

    useEffect(() => {
        console.log('cutoff times: ', cutoffTimes)
    }, [cutoffTimes]);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const tabTitlesArr = ['User profile'];
    if (apiProtocolsData !== null) tabTitlesArr.push('Delivery protocols');
    if (pricesData !== null || contractsData !== null) tabTitlesArr.push('Contracts and prices');
    if (warehouseInfoData !== null) tabTitlesArr.push('Warehouses info');
    if (cutoffTimes !== null) tabTitlesArr.push('Cutoff times');
    const tabTitles = tabTitlesArr.map(item => ({ title: item }));

    console.log('tabTitles', apiProtocolsData, pricesData, contractsData, warehouseInfoData);

    return (
        <Layout hasFooter>
            <SeoHead title='Profile' description='Our profile page' />
            <div className={`page-component ${styles['profile-page']}`}>
                {isLoading && <Loader />}
                <Header pageTitle='Profile' toRight />
                <div className={`card ${styles['profile-page__container']}`}>
                    <Tabs id='profile-tabs' tabTitles={tabTitles} withHorizontalDivider needContentScroll={false}>
                        <div key='profile-info-tab' className={styles['profile-page-tab']}>
                            <ProfileInfo userInfo={profileInfo} />
                        </div>
                        {apiProtocolsData !== null ? <div key='protocols-tab' className={styles['profile-page-tab']}>
                            <ApiProtocols apiProtocols={apiProtocolsData} />
                        </div> : null}
                        {pricesData !== null || contractsData !== null ? <div key='prices-and-contracts-tab' className={styles['profile-page-tab']}>
                            <UserContractsAndPrices prices={pricesData} contracts={contractsData} />
                        </div> : null}
                        {warehouseInfoData !== null ? <div key='warehouse-info-tab' className={styles['profile-page-tab']}>
                            <WarehouseInfo warehouseInfoData={warehouseInfoData} />
                        </div> : null}
                        {cutoffTimes !== null ? <div key='cutoff-times-tab' className={styles['profile-page-tab']}>
                            <CutOffTime cutoffTimes={cutoffTimes} />
                        </div> : null}

                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
