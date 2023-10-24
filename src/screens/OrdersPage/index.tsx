import React from 'react';
import Layout from "@/components/Layout/Layout";
import Dropzone from "@/components/Dropzone";

const OrdersPage = () => {

    return (
        <Layout hasHeader hasFooter>
            <Dropzone />
        </Layout>
    )
}

export default OrdersPage;