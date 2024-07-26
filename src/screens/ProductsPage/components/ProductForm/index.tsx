import React, {useCallback, useEffect, useMemo, useState} from 'react';
import "./styles.scss";
import useAuth from "@/context/authContext";
import {ProductParamsType, ProductType, SingleProductType} from "@/types/products";
import {getProductByUID, getProductParameters, getProducts} from "@/services/products";
import {ToastContainer} from '@/components/Toast';
import "@/styles/tables.scss";
import '@/styles/forms.scss';
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import ProductFormComponent from "@/screens/ProductsPage/components/ProductForm/ProductFormComponent";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import {useTranslations} from "next-intl";

type ProductPropsType = {
    uuid?: string | null;
    products?: ProductType[];
    onClose: ()=>void;
    onCloseSuccess: ()=>void;
}
const ProductForm:React.FC<ProductPropsType> = ({uuid, products = null, onClose, onCloseSuccess}) => {
    const t = useTranslations('ProductsPage')

    const [productParams, setProductParams] = useState<ProductParamsType|null>(null);
    const [productData, setProductData] = useState<SingleProductType|null>(null);
    const [productsList, setProductsList] = useState<ProductType[]|null>(products);

    const { token, superUser, ui } = useAuth();

    const {setDocNotificationsAsRead} = useMarkNotificationAsRead();

    const [isLoading, setIsLoading] = useState(false);

    const fetchProductData = async (uuid) => {
        try {
            setIsLoading(true);
            const requestData = {token: token, uuid: uuid};
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
            const requestData = {token: token};
            const resParams: ApiResponse = await getProductParameters(superUser && ui ? {...requestData, ui} : requestData);

            if (resParams && "data" in resParams) {
                setProductParams(resParams.data);
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
            const requestData = {token: token};
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
        { productParams && (uuid && productData || !uuid) && (productsList !== null) ?
            <Modal title={t('productModalTitle')} onClose={onCloseModal} >
                <ProductFormComponent
                    productParams={productParams}
                    productData={productData}
                    uuid={uuid}
                    products={productsAsOptions}
                    closeProductModal={onCloseModalOnSuccess}
                    refetchDoc={()=>{fetchProductData(uuid)}}
                />
            </Modal> : null
        }
    </div>
}

export default ProductForm;