import React, {useCallback, useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header";
import { AntiFraudDefaultSettingsType, AntiFraudSettingsFormType} from "./types";
import AntiFraudSettings from "@/screens/AntiFraudSettingsPage/components/SettingsForm";
import {sendUserBrowserInfo} from "@/services/userInfo";
import {AccessActions, AccessObjectTypes} from "@/types/auth";
import useAuth from "@/context/authContext";
import useTenant from "@/context/tenantContext";
import { getAntiFraudSettingsList } from "@/services/antiFraud";
import SettingsList from "@/screens/AntiFraudSettingsPage/components/SettingsList";
import Modal from "@/components/Modal";
import Button from "@/components/Button/Button";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import Loader from "@/components/Loader";


const AntiFraudSettingsPage = () => {
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();
    const {tenant, getTenantData} = useTenant();
    const tenantData = getTenantData(tenant);

    //pagination
    const [currentPage, setCurrentPage] = useState<number>(1);

    //get settingsData
    const [isLoading, setIsLoading] = useState(false);
    const [settingsListData, setSettingsListData] = useState<AntiFraudSettingsFormType[]>([]);
    const [settingsDefaultData, setSettingsDefaultData] = useState<AntiFraudDefaultSettingsType | null>(null);

    useEffect(() => {

    }, []);

    const fetchListData = useCallback(async () => {
        try {
            setIsLoading(true);
            setSettingsListData([]);
            const requestData = { token: token, alias: tenantData?.alias };

            try {
                sendUserBrowserInfo({ ...getBrowserInfo('GetAntiFraudSettingsList', AccessObjectTypes["AntiFraud/Settings"], AccessActions.ListView), body: superUser && ui ? { ...requestData, ui } : requestData })
            } catch { }

            if (!isActionIsAccessible(AccessObjectTypes["AntiFraud/Settings"], AccessActions.ListView)) {
                setSettingsListData([]);
                return null;
            }

            const res = await getAntiFraudSettingsList(superUser && ui ? { ...requestData, ui } : requestData);

            if (res && "data" in res) {

                if (res?.data?.defaultSettings) {
                    setSettingsDefaultData(res.data.defaultSettings);
                }

                if (res?.data?.settingsList) {
                    setSettingsListData(res.data.settingsList);
                }
                // setSettingsListData(res.data.map(item => ({ ...item, key: item.uuid })).sort((a: OrderType, b: OrderType) => a.date > b.date ? -1 : 1));
            } else {
                console.error("API did not return expected data");
            }
            setCurrentPage(1);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }

    },[token, ui]);

    useEffect(() => {
        fetchListData();
    }, [token, ui, fetchListData]);

    const [selectedSettingCode, setSelectedSettingCode] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    //status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({ onClose: () => setShowStatusModal(false) });
    const closeErrorModal = useCallback(() => setShowStatusModal(false), []);

    const handleEdit = (code: string) => {
        if (!isActionIsAccessible(AccessObjectTypes["AntiFraud/Settings"], AccessActions.Edit)) {
            try {
                sendUserBrowserInfo({
                    ...getBrowserInfo('ViewAntiFraudSettings', AccessObjectTypes["AntiFraud/Settings"], AccessActions.View),
                    body: {}
                });
            } catch {
            }

            setModalStatusInfo({
                statusModalType: STATUS_MODAL_TYPES.ERROR,
                title: "Warning",
                subtitle: `You have limited access to this action`,
                onClose: closeErrorModal
            });
            setShowStatusModal(true);
            return;
        }

        setSelectedSettingCode(code);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedSettingCode(null);
        setIsCreatingNew(false);
    };

    const handleSuccessSave = () => {
        handleCloseModal();
        fetchListData(); // Refresh the list
    };

    const selectedSetting = settingsListData.find(s => s.code === selectedSettingCode);

    const handleAddSetting = () => {

        try {
            if (!isActionIsAccessible(AccessObjectTypes["AntiFraud/Settings"], AccessActions.Edit)) {
                try {
                    sendUserBrowserInfo({ ...getBrowserInfo('CreateAntiFraudSettings', AccessObjectTypes["AntiFraud/Settings"], AccessActions.Edit), body: { } });
                } catch { }

                setModalStatusInfo({
                    statusModalType: STATUS_MODAL_TYPES.ERROR,
                    title: "Warning",
                    subtitle: `You have limited access to this action`,
                    onClose: closeErrorModal
                });
                setShowStatusModal(true);
                return;
            } else {
                setSelectedSettingCode(null);
                setIsCreatingNew(true);
                setIsModalVisible(true);
            }
        } catch (e) {
            //something went wrong
        }

    };

    return (
        <Layout hasFooter>
            <div className={`page-component`}>
                <Header pageTitle='WAPI Checker settings' toRight >
                    <Button classNames='add-anti-fraud-settings' icon="add" iconOnTheRight onClick={handleAddSetting}>Add new settings</Button>
                </Header>
                {isLoading ? <Loader /> : null}
                <SettingsList 
                    settingsList={settingsListData} 
                    handleEdit={handleEdit} 
                />

                {isModalVisible ? <Modal
                    title="WAPI Checker settings"
                    onClose={handleCloseModal}
                    classNames='document-modal'
                >
                    {(selectedSetting || isCreatingNew) && settingsDefaultData && (
                        <AntiFraudSettings 
                            antiFraudData={selectedSetting} 
                            onSuccessSave={handleSuccessSave}
                            defaultSettings={settingsDefaultData}
                        />
                    )}
                </Modal> : null}
            </div>
            {showStatusModal && <ModalStatus {...modalStatusInfo} />}
        </Layout>
    );
};

export default AntiFraudSettingsPage;
