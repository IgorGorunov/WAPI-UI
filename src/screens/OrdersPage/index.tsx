import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getProducts } from "@/services/products";

import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "./components/Header"
import OrderList from "./components/OrderList";
import {verifyToken} from "@/services/auth";
import "./styles.scss";
import {getOrders} from "@/services/orders";
import Skeleton from "@/components/Skeleton/Skeleton";

const OrdersPage = () => {

    const Router = useRouter();
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');
    if (savedToken) setToken(savedToken);

    const [ordersData, setOrdersData,] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        type ApiResponse = {
            data: any;
        };

        const fetchData = async () => {
            try {
                setIsLoading(true);
                //verify token
                console.log("token: ", token);
                if (!await verifyToken(token)) {
                    console.log("token is wrong");
                    await Router.push(Routes.Login);
                }

                const res: ApiResponse = await getOrders(
                    {token: token}
                );

                if (res && "data" in res) {
                    setOrdersData(res.data);
                    setIsLoading(false);
                } else {
                    console.error("API did not return expected data");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    console.log("orders data: ", ordersData);

    return (
        <Layout hasHeader hasFooter>
            <div className="orders-page__container">
                {isLoading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 1000
                    }}>
                        <Skeleton type="loader" width="500px" height="300px" />
                    </div>
                )}
                <Header />
                {ordersData && <OrderList orders={ordersData}/>}
            </div>
        </Layout>
    )
}

export default OrdersPage;