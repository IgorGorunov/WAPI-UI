import React, {useEffect, useMemo, useState} from "react";
import "./styles.scss";
import '@/styles/tables.scss';
import '@/styles/forms.scss';
import Button from "@/components/Button/Button";
import {ProductsSelectionType} from "@/types/utility";
import SearchContainer from "@/components/SearchContainer";
import SearchField from "@/components/SearchField";
import {FormFieldTypes} from "@/types/forms";
import {Table, TableColumnProps} from "antd";
import TitleColumn from "@/components/TitleColumn";
import Icon from "@/components/Icon";
import TableCell from "@/components/TableCell";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import RadioButton from "@/components/FormBuilder/RadioButton";


export type SelectedProductType = {
    key?: string;
    product: string;
    name?: string;
    quantity: number;
}

type ProductSelectionPropsType = {
    productList: ProductsSelectionType[];
    alreadyAdded: SelectedProductType[];
    handleAddSelection: (selectedProducts: SelectedProductType[]) => void;
};

const getWarehouseCountry = (productList:ProductsSelectionType[], warehouse: string) => {
    const products = productList.filter(item => item.warehouse===warehouse);
    if (products.length) {
        return products[0].country
    }
    return '';
}

const ProductSelection: React.FC<ProductSelectionPropsType> = ({productList, alreadyAdded, handleAddSelection}) => {
    const [filteredProducts, setFilteredProducts]  = useState(productList);

    const warehouseOptions = useMemo(()=> {
        const warehouses = productList.map(item => (item.warehouse));
        const uniqueWarehouses = Array.from(new Set(warehouses))
        const warehouseOptionsArray = uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
            extraInfo: getWarehouseCountry(productList, warehouse) || '',
        }));

        warehouseOptionsArray.unshift({value: 'off', label: "All warehouses", extraInfo: ''});

        return warehouseOptionsArray;
    }, [productList]);

    const [selectedWarehouse, setSelectedWarehouse] = useState( warehouseOptions.length ? warehouseOptions[0].value : '')

    const productOptions = useMemo(() =>{
        const uniqueProducts = Array.from(new Set(productList.map(item => item.uuid)));
        return  uniqueProducts.map(uuid => ({
            value: uuid,
            label: productList.filter(item => item.uuid === uuid)[0].name,
        }));
    },[productList]);

    useEffect(() => {
        setSelectedWarehouse(warehouseOptions.length ? warehouseOptions[0].value : '');
    }, [warehouseOptions]);


    //form
    const {control, formState: { errors }, getValues, watch} = useForm({
        mode: 'onSubmit',
        defaultValues: {
            products:
                alreadyAdded && alreadyAdded.length ?
                    alreadyAdded.map((product) => (
                        {
                            key: product.key,
                            product: product.product,
                            name: '123',
                            quantity: product.quantity || '',
                        }))
                    : [] as SelectedProductType[],
        }
    });

    const { append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' });
    const selectedProducts = watch('products');


    //search
    const [searchTerm, setSearchTerm] = useState('');
    const [fullTextSearchSelection, setFullTextSearchSelection] = useState(true);
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearchSelection',
        label: 'Full text search',
        checked: fullTextSearchSelection,
        onChange: ()=>{setFullTextSearchSelection(prevState => !prevState);},
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
    };

    useEffect(() => {
        //filtering
        const filteredProducts1 = productList.filter(product => {
            const matchesSearch = !searchTerm.trim() || Object.keys(product).some(key => {
                const value = product[key];
                if (key !== 'uuid') {
                    const stringValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
                    const searchTermsArray = searchTerm.trim().toLowerCase().split(' ');

                    if (fullTextSearchSelection) {
                        return searchTermsArray.every(word => stringValue.includes(word));
                    } else {
                        return searchTermsArray.some(word => stringValue.includes(word));
                    }
                }
                return false;
            });
            const matchesWarehouse = selectedWarehouse==='off' || selectedWarehouse === product.warehouse;

            //const isSelected = selectedProducts.filter(item => item.product === product.uuid).length > 0;

            return matchesSearch && matchesWarehouse;
        });

        setFilteredProducts(filteredProducts1);

    }, [searchTerm, selectedProducts, selectedWarehouse]);


    // useEffect(() => {
    //     filteredProducts.forEach(item => {
    //         const curItemUuid = item.uuid;
    //
    //     })
    // }, [selectedProducts]);

    const addProduct = (record: ProductsSelectionType) => {
        appendProduct({key: `${record.uuid}-${Date.now().toString()}`, product: record.uuid, name: record.name, quantity: 1})
    }

    //columns
    const allProductsColumns: TableColumnProps<ProductsSelectionType>[]  = [
        {
            title: <TitleColumn title="Product name" minWidth="100px" maxWidth="150px" contentPosition="start"/>,
            render: (text: string, record: ProductsSelectionType) => (
                <TableCell value={record.name} minWidth="100px" maxWidth="150px" contentPosition="start"/>
            ),
            dataIndex: 'uuid',
            key: 'uuid',
            sorter: true,
            // onHeaderCell: (column: ColumnType<OrderType>) => ({
            //     onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            // }),
        },
        {
            title: <TitleColumn title="SKU" minWidth="80px" maxWidth="150px" contentPosition="start"/>,
            render: (text: string, record: ProductsSelectionType) => (
                <TableCell value={text} minWidth="80px" maxWidth="150px" contentPosition="start"/>
            ),
            dataIndex: 'sku',
            key: 'sku',
            sorter: true,
            // onHeaderCell: (column: ColumnType<OrderType>) => ({
            //     onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            // }),
        },
        {
            title: <TitleColumn title="Aliases" minWidth="100px" maxWidth="250px" contentPosition="start"/>,
            render: (text: string, record: ProductsSelectionType) => (
                <TableCell value={text.trim().slice(-1)==='|' ? text.trim().slice(0, text.length-2) : text} minWidth="100px" maxWidth="250px" contentPosition="start"/>
            ),
            dataIndex: 'aliases',
            key: 'aliases',
            sorter: true,
            // onHeaderCell: (column: ColumnType<OrderType>) => ({
            //     onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            // }),
        },
        {
            title: <TitleColumn title="Barcodes" minWidth="100px" maxWidth="250px" contentPosition="start"/>,
            render: (text: string, record: ProductsSelectionType) => (
                <TableCell value={text.trim().slice(-1)==='|' ? text.trim().slice(0, text.length-2) : text} minWidth="100px" maxWidth="250px" contentPosition="start"/>
            ),
            dataIndex: 'barcodes',
            key: 'barcodes',
            sorter: true,
            // onHeaderCell: (column: ColumnType<OrderType>) => ({
            //     onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            // }),
        },
        {
            title: <TitleColumn title="Warehouse" minWidth="70px" maxWidth="70px" contentPosition="start"/>,
            render: (text: string, record: ProductsSelectionType) => (
                <TableCell
                    // value={text}
                    minWidth="70px"
                    maxWidth="70px"
                    contentPosition="start"
                    childrenBefore={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className={`fi fi-${record.country.toLowerCase()} flag-icon`}></span>
                            {/*<div style={{ fontSize: '8px' }}>{record.country}</div>*/}
                            {text}
                        </div>
                    }
                />
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            // onHeaderCell: (column: ColumnType<OrderType>) => ({
            //     onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            // }),
        },
        {
            title: <TitleColumn title="Available" minWidth="60px" maxWidth="60px" contentPosition="start"/>,
            render: (text: string, record: ProductsSelectionType) => (
                <TableCell value={text} minWidth="60px" maxWidth="60px" contentPosition="center"/>
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            // onHeaderCell: (column: ColumnType<OrderType>) => ({
            //     onClick: () => handleHeaderCellClick(column.dataIndex as keyof OrderType),
            // }),
        },
        {
            title: '',
            key: 'action',
            width: 30,
            render: (text, record, index) => (
                <button className='action-btn add-type' onClick={() => addProduct(record)}>
                    <Icon name='shopping-cart' />
                </button>
            ),
        },
    ];

    const getSelectedProductColumns = (control: any) => {
        return [

            {
                title: 'Product',
                dataIndex: 'product',
                width: '100%',
                key: 'product',
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.product`}
                        control={control}
                        defaultValue={record.product}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{}}>
                                <FieldBuilder
                                    name={`products.${index}.product`}
                                    fieldType={FormFieldTypes.SELECT}
                                    {...field}
                                    options={productOptions}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={true}
                                    isClearable={false}
                                    classNames='product-field'
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                minWidth: 0,
                render: (text, record, index) => (
                    <Controller
                        name={`products.${index}.quantity`}
                        control={control}
                        render={({ field , fieldState: {error}}) => (
                            <div style={{maxWidth: '70px'}}>
                                <FieldBuilder
                                    name={`products.${index}.quantity`}
                                    fieldType={FormFieldTypes.NUMBER}
                                    {...field}
                                    errorMessage={error?.message}
                                    errors={errors}
                                    isRequired={false}
                                    noCounters={false}
                                    classNames='quantity-field'
                                />
                            </div>
                        )}
                        rules={{ required: 'filed is required' }}
                    />
                ),
            },
            {
                title: '',
                key: 'action',
                width: 30,
                render: (text, record, index) => (
                    <button className='action-btn remove-type' onClick={() => removeProduct(index)}>
                        <Icon name='waste-bin'/>
                    </button>
                ),
            },
        ];
    };

    return (
        <div className="product-selection">
            <div className="product-selection__container">
                <div className='product-selection__warehouses'>
                    <RadioButton name='warehouseSelection' isCountry={true} options={warehouseOptions} value={selectedWarehouse} onChange={(val)=>setSelectedWarehouse(val as string)}/>
                </div>
                <div className="product-selection__search">

                    <SearchContainer>
                        <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                        <FieldBuilder {...fullTextSearchField} />
                    </SearchContainer>
                </div>
                <div className="product-selection__wrapper">
                    <div className='card table form-table product-selection__items product-selection__table '>
                        <Table
                            dataSource={filteredProducts}
                            columns={allProductsColumns}
                            pagination={false}
                            scroll={{y:220}}
                        />
                    </div>
                    <div className='product-selection__table-title title-h4'>
                        Selected into document products:
                    </div>
                    <div className='card table form-table table-form-fields product-selection__selected product-selection__table'>
                        <Table
                            columns={getSelectedProductColumns(control)}
                            dataSource={getValues('products')?.map((field, index) => ({ key: field.uuid+'-'+index, ...field })) || []}
                            pagination={false}
                            scroll={{y:220}}
                            rowKey="key"
                        />
                    </div>
                    <div className='product-selection__buttons'>
                        <Button onClick={ ()=>handleAddSelection(selectedProducts as SelectedProductType[])}>Add to document</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSelection;
