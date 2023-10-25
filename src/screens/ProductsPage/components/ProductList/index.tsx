import React from "react";
import { Table } from 'antd';
import Button from "@/components/Button/Button";
import "./styles.scss";

type ProductType = {
    aliases: string;
    dimension: string;
    name: string;
    sku: string;
    uuid: string;
    weight: number;
    stock: {
        available: number;
    }
}
type ProductListType = {
    products: ProductType[];
}
const ProductList: React.FC<ProductListType> = ({products}) => {
    console.log("products prop:", products)
    const columns = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Dimension | mm',
            dataIndex: 'dimension',
            key: 'dimension',
        },
        {
            title: 'Weight | kg',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Aliases',
            dataIndex: 'aliases',
            key: 'aliases',
        },
        ];
    return (
        <div className={`card product-list__container mb-md`}>
            <Table dataSource={products} columns={columns} />;

        </div>
    );
};

export default ProductList;