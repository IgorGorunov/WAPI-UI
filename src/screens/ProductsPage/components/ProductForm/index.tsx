import React, {useCallback, useEffect, useMemo, useState} from 'react';
import "./styles.scss";
import useAuth, {AccessActions, AccessObjectTypes, UserAccessActionType} from "@/context/authContext";
import {ProductParamsType, ProductType, SingleProductType} from "@/types/products";
import {getProductByUID, getProductParameters, getProducts} from "@/services/products";
import {ToastContainer} from '@/components/Toast';
import "@/styles/tables.scss";
import '@/styles/forms.scss';
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import ProductFormComponent from "@/screens/ProductsPage/components/ProductForm/ProductFormComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {sendUserBrowserInfo} from "@/services/userInfo";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import useTenant from "@/context/tenantContext";

type ProductPropsType = {
    uuid?: string | null;
    products?: ProductType[];
    onClose: ()=>void;
    onCloseSuccess: ()=>void;
}
const ProductForm:React.FC<ProductPropsType> = ({uuid, products = null, onClose, onCloseSuccess}) => {
    const [productParams, setProductParams] = useState<ProductParamsType|null>(null);
    const [productData, setProductData] = useState<SingleProductType|null>(null);
    const [productsList, setProductsList] = useState<ProductType[]|null>(products);
    const [forbiddenTabs, setForbiddenTabs] = useState<string[]|null>(null);

    const { tenantData: { alias }} = useTenant();
    const { token, superUser, ui, getBrowserInfo, isActionIsAccessible } = useAuth();

    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [isLoading, setIsLoading] = useState(false);

    //status modal
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({onClose: ()=>setShowStatusModal(false)})
    const closeErrorModal = useCallback(()=>{
        setShowStatusModal(false);
    }, [])

    const fetchProductData = async (uuid) => {
        try {
            setIsLoading(true);
            const requestData = {token, alias, uuid};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetProductData', AccessObjectTypes["Products/ProductsList"], AccessActions.ViewObject), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.ViewObject)) {
                setModalStatusInfo({statusModalType: STATUS_MODAL_TYPES.ERROR, title: "Warning", subtitle: `You have limited access to this action`, onClose: closeErrorModal})
                setShowStatusModal(true);
                return null;
            }

            const res: ApiResponse = await getProductByUID(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setProductData(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProductParams = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = {token, alias};

            // try {
            //     sendUserBrowserInfo({...getBrowserInfo('GetProductParameters'), body: superUser && ui ? {...requestData, ui} : requestData})
            // } catch {}

            const resParams: ApiResponse = await getProductParameters(superUser && ui ? {...requestData, ui} : requestData);

            if (resParams && "data" in resParams) {
                setProductParams(resParams.data);
                if (resParams.data.actionAccessSettings) {
                    const tabs = resParams.data.actionAccessSettings as UserAccessActionType[];
                    const tabsInString = [];
                    tabs.forEach(item => {
                        if (item.action === 'View' && item.forbidden) {
                            const temp = item.objectType.split('/');
                            tabsInString.push(temp[temp.length - 1]);
                        }
                    })
                    setForbiddenTabs(tabsInString);
                } else {
                    setForbiddenTabs([]);
                }
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[]);

    const fetchProductsList = useCallback(async () => {
        try {
            setIsLoading(true);
            const requestData = {token, alias};

            try {
                sendUserBrowserInfo({...getBrowserInfo('GetProductsList', AccessObjectTypes["Products/ProductsList"], AccessActions.ListView), body: superUser && ui ? {...requestData, ui} : requestData})
            } catch {}

            if (!isActionIsAccessible(AccessObjectTypes["Products/ProductsList"], AccessActions.ListView)) {
                return [];
            }

            const res: ApiResponse = await getProducts(superUser && ui ? {...requestData, ui} : requestData);

            if (res && "data" in res) {
                setProductsList(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[]);

    useEffect(() => {
        fetchProductParams();

        if (uuid) {
            fetchProductData(uuid);
        }

        if (!productsList) {
            fetchProductsList();
        }
    }, [token, uuid]);

    const productsAsOptions = useMemo(()=>{
        return productsList ? productsList.map(item => {
            const sum = item.stock.reduce((sum: number, cur)=> sum+cur.available, 0);
            return {...item, quantity: sum};
        }) : [];

    },[productsList])

    const onCloseModal = () => {
        onClose();
        if (uuid) {
            setDocNotificationsAsRead(uuid);
        }
    }

    const onCloseModalOnSuccess = () => {
        onCloseSuccess();
        if (uuid) {
            setDocNotificationsAsRead(uuid);
        }
    }


    type ApiResponse = {
        data?: any;
        response?: {
            data?: {
                errorMessage: string[];
            }
        }
    };

    return <div className='product-info'>
        {isLoading && <Loader />}
        <ToastContainer />
        { productParams && (uuid && productData || !uuid) && (productsList !== null) && forbiddenTabs !==null ?
            <Modal title={`${productData ? 'Product': 'Product'}`} onClose={onCloseModal} classNames='document-modal'>
                <ProductFormComponent
                    productParams={productParams}
                    productData={productData}
                    uuid={uuid}
                    products={productsAsOptions}
                    closeProductModal={onCloseModalOnSuccess}
                    refetchDoc={()=>{fetchProductData(uuid)}}
                    forbiddenTabs={forbiddenTabs}
                />
            </Modal> : null
        }
        {showStatusModal && <ModalStatus {...modalStatusInfo}/>}
    </div>
}

export default ProductForm;