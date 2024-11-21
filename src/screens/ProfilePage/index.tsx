import React, {useCallback, useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Head from "next/head";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import ProfileInfo from "./components/ProfileInfo";
import ApiProtocols from "./components/ApiProtocols";
import {ApiProtocolType, UserPriceType} from "@/types/profile";
import {getApiProtocols, getUserContracts, getUserPrices} from "@/services/profile";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import UserContractsAndPrices from "./components/UserContractsAndPrices";
import {sendUserBrowserInfo} from "@/services/userInfo";

const ProfilePage = () => {
    const {token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [apiProtocolsData, setApiProtocolsData] = useState<ApiProtocolType[]|null>(null);
    const [pricesData, setPricesData] = useState<UserPriceType[]|null>(null);
    const [contractsData, setContractsData] = useState<any[]|null>(null);

    const fetchProfileData = useCallback(async() => {
        try {
            setIsLoading(true);
            const requestData = {token};
            try {
                sendUserBrowserInfo({...getBrowserInfo('GetDeliveryProtocols', AccessObjectTypes["Profile/DeliveryProtocols"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Profile/DeliveryProtocols"], AccessActions.ListView)) {
                setApiProtocolsData([]);
            } else {
                const res = await getApiProtocols(superUser && ui ? {...requestData, ui} : requestData);
                if (res.status === 200) {
                    setApiProtocolsData(res.data);
                }
            }

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetClientPriceList', AccessObjectTypes["Profile/Prices"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Profile/Prices"], AccessActions.ListView)) {
                setPricesData([]);
            } else {
                const resPrices = await getUserPrices(superUser && ui ? {...requestData, ui} : requestData);
                if (resPrices.status === 200) {
                    setPricesData(resPrices.data);
                }
            }

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetContractsList', AccessObjectTypes["Profile/Contracts"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}
            if (!isActionIsAccessible(AccessObjectTypes["Profile/Contracts"], AccessActions.ListView)) {
                setPricesData([]);
            } else {
                const resContracts = await getUserContracts(superUser && ui ? {...requestData, ui} : requestData);
                if (resContracts.status === 200) {
                    setContractsData(resContracts.data);
                }
            }

        } catch {
            //something went wrong
        } finally {
            setIsLoading(false);
        }
    }, [token, ui]);

    useEffect(() => {


        fetchProfileData();
    }, []);

    const tabTitles = ['User profile', 'Delivery protocols', 'Contracts and prices'].map(item=>({title: item}));

    return (
        <Layout hasFooter>
            <Head>
                <title>Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>
            <div className="page-component profile-page">
                {isLoading && <Loader />}
                <Header pageTitle='Profile' toRight  />
                <div className='card profile-page__container'>
                    <Tabs id='profile-tabs' tabTitles={tabTitles} withHorizontalDivider>
                        <div key='profile-info-tab' className='profile-page-tab'>
                            <ProfileInfo/>
                        </div>
                        <div key='protocols-tab' className='profile-page-tab'>
                            <ApiProtocols apiProtocols={apiProtocolsData}/>
                        </div>
                        <div key='prices-and-contracts-tab' className='profile-page-tab'>
                            <UserContractsAndPrices prices={pricesData} contracts={contractsData}/>
                        </div>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
