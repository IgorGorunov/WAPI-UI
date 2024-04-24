import React, {useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Head from "next/head";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import ProfileInfo from "@/screens/ProfilePage/components/ProfileInfo";
import ApiProtocols from "@/screens/ProfilePage/components/ApiProtocols";
import {ApiProtocolType} from "@/types/profile";
import {getApiProtocols} from "@/services/profile";
import useAuth from "@/context/authContext";

const ProfilePage = () => {
    const {token} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [apiProtocolsData, setApiProtocolsData] = useState<ApiProtocolType[]|null>(null);

    useEffect(() => {
        const fetchApiProtocols = async() => {
            try {
                setIsLoading(true);
                const res = await getApiProtocols({token});
                if (res.status === 200) {
                    setApiProtocolsData(res.data);
                }
            } catch {
                //something went wrong
            } finally {
                setIsLoading(false);
            }
        }

        fetchApiProtocols();
    }, []);

    const tabTitles = ['User profile', 'Delivery protocols'].map(item=>({title: item}));

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
                    <Tabs id='order-tabs' tabTitles={tabTitles}>
                        <div key='prices-tab' className='profile-page-tab'>
                            <ProfileInfo />
                        </div>
                        <div key='legal-tab' className='profile-page-tab'>
                            <ApiProtocols apiProtocols={apiProtocolsData}/>
                        </div>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
