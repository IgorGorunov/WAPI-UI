import React, {useCallback, useMemo, useState, useEffect} from "react";
import {Table, Pagination, Tooltip, Popover} from 'antd';
import {ColumnType} from "antd/es/table";
import "./styles.scss";
import "@/styles/tables.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import {ProductStockType} from "@/types/products";
import PageSizeSelector from '@/components/LabelSelect';
import TitleColumn from "@/components/TitleColumn"
import TableCell from "@/components/TableCell";
import Icon from "@/components/Icon";
import Head from "next/head";
import {PageOptions} from '@/constants/pagination';
import SearchField from "@/components/SearchField";
import CurrentFilters from "@/components/CurrentFilters";
import Button, {ButtonVariant} from "@/components/Button/Button";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";
import FiltersBlock from "@/components/FiltersBlock";
import SearchContainer from "@/components/SearchContainer";
import {Countries} from "@/types/countries";
import FiltersContainer from "@/components/FiltersContainer";
import SimplePopup from "@/components/SimplePopup";
import {useIsTouchDevice} from "@/hooks/useTouchDevice";

type ProductListType = {
    products: ProductStockType[];
    setFilteredProducts: React.Dispatch<React.SetStateAction<ProductStockType[]>>;
    setWarehouseForExport: (warehouse: string)=>void
}

const ProductList: React.FC<ProductListType> = ({products, setFilteredProducts, setWarehouseForExport}) => {
    const [animating, setAnimating] = useState(false);
    const isTouchDevice = useIsTouchDevice();

    // Popup
    const getPopupItems = useCallback((hoveredReserve)=> {
        if (!hoveredReserve) return [];

        return hoveredReserve.reservedRows.map(stockItem => ({
            uuid: hoveredReserve.uuid,
            title: stockItem.document,
            description: stockItem.reserved,
        }));
    },[]);

    // Pagination
    const [current, setCurrent] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const handleChangePage = (page: number) => {
        setAnimating(true);
        setTimeout(() => {
            setCurrent(page);
            setAnimating(false);
        }, 500);
    };
    const handleChangePageSize = (size: number) => {
        setPageSize(size);
        setCurrent(1);
    };

    // Sorting
    const [sortColumn, setSortColumn] = useState<keyof ProductStockType>('name');
    const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');
    const handleHeaderCellClick = useCallback((columnDataIndex: keyof ProductStockType) => {
        setSortDirection(currentDirection =>
            sortColumn === columnDataIndex && currentDirection === 'ascend' ? 'descend' : 'ascend'
        );
        setSortColumn(columnDataIndex);
    }, [sortColumn]);


    // Filter and searching
    const calcOrderAmount = useCallback((property: string, value: string) => {
        return products.filter(product => product[property].toLowerCase() === value.toLowerCase()).length || 0;
    },[products]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterWarehouse, setFilterWarehouse] = useState<string[]>([]);

    const uniqueWarehouses = useMemo(() => {
        const warehouses = products.map(product => product.warehouse);
        return Array.from(new Set(warehouses)).filter(warehouse => warehouse).sort();
    }, [products]);
    uniqueWarehouses.sort();
    const transformedWarehouses = useMemo(() => ([
        ...uniqueWarehouses.map(warehouse => ({
            value: warehouse,
            label: warehouse,
            amount: calcOrderAmount('warehouse', warehouse),
        }))
    ]), [uniqueWarehouses]);

    // useEffect(() => {
    //     setFilterWarehouse(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueWarehouses.includes(selectedValue))];
    //     })
    // }, [uniqueWarehouses]);

    const [isOpenFilterWarehouse, setIsOpenFilterWarehouse] = useState(false);

    const [filterCountry, setFilterCountry] = useState<string[]>([]);

    const uniqueCountries = useMemo(() => {
        const countries = products.map(product => product.country);
        return Array.from(new Set(countries)).filter(country => country).sort();
    }, [products]);
    uniqueCountries.sort();
    const transformedCountries = useMemo(() => ([
        ...uniqueCountries.map(country => ({
            value: country,
            label: Countries[country] || country,
            amount: calcOrderAmount('country', country),
        }))
    ]), [uniqueCountries]);

    // useEffect(() => {
    //     setFilterCountry(prevState => {
    //         return [...prevState.filter(selectedValue => uniqueCountries.includes(selectedValue))];
    //     })
    // }, [uniqueCountries]);

    const [isOpenFilterCountry, setIsOpenFilterCountry] = useState(false);

    const [fullTextSearch, setFullTextSearch] = useState(true);
    const fullTextSearchField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'fullTextSearch',
        label: 'Full text search',
        checked: fullTextSearch,
        onChange: ()=>{setFullTextSearch(prevState => !prevState)},
        classNames: 'full-text-search-toggle',
        hideTextOnMobile: true,
    }

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const handleClearAllFilters = () => {
        setFilterWarehouse([]);
        setFilterCountry([]);

        //close filter modal
        //setIsFiltersVisible(false);
    }

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTerm(newSearchTerm);
    };

    const filteredProducts = useMemo(() => {
        setCurrent(1);
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = products.filter(product => {
            const matchesSearch = !searchTerm || Object.keys(product).some(key => {
                const value = product[key];
                return key !== 'uuid' && typeof value === 'string' && value.toLowerCase().includes(searchTermLower);
            });
            const matchesWarehouse = !filterWarehouse.length || filterWarehouse.map(item=>item.toLowerCase()).includes(product.warehouse.toLowerCase());
            const matchesCountry = !filterCountry.length || filterCountry.map(item=>item.toLowerCase()).includes(product.country.toLowerCase());
            return matchesSearch && matchesWarehouse && matchesCountry;
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                if (sortDirection === 'ascend') {
                    return a[sortColumn] > b[sortColumn] ? 1 : -1;
                } else {
                    return a[sortColumn] < b[sortColumn] ? 1 : -1;
                }
            });
        }
        return filtered;
    }, [products, searchTerm, filterWarehouse, filterCountry, sortColumn, sortDirection]);

    useEffect(() => {
        setFilteredProducts(filteredProducts)
    }, [filteredProducts]);

    useEffect(() => {
        setWarehouseForExport(filterWarehouse.join('_'))
    }, [filterWarehouse]);

    const curWidth = useMemo(()=>{
        const displayedData = filteredProducts.slice((current - 1) * pageSize, current * pageSize);
        const maxAmount = displayedData.reduce((acc,item)=> Math.max(acc, item.reserved),0).toString().length;

        const width = 63+maxAmount*9;
        return width.toString()+'px';
    },[current, pageSize, filteredProducts]);

    const columns: ColumnType<ProductStockType>[] = useMemo(() => [
        {
            title: <TitleColumn title="" minWidth="15px" maxWidth="15px" contentPosition="center"
            />,
            render: (text: string) => (
               <TableCell
                    minWidth="15px"
                    maxWidth="15px"
                    contentPosition="center"
                    childrenBefore={<span className={`fi fi-${text.toLowerCase()} "flag-icon"`}></span>}>
               </TableCell>
            ),
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: <TitleColumn
                minWidth="40px"
                maxWidth="40px"
                contentPosition="center"
                childrenBefore={
                    <Tooltip title="Code of warehouse" >
                        <span><Icon name={"warehouse"}/></span>
                    </Tooltip>
                }
            />,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px"  contentPosition="start"/>
            ),
            dataIndex: 'warehouse',
            key: 'warehouse',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn minWidth="80px" maxWidth="120px" contentPosition="start" childrenBefore={<Tooltip title="A unique code for tracking each product in inventory"><span>SKU</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="80px" maxWidth="120px"  contentPosition="start"/>
            ),
            dataIndex: 'warehouseSku',
            key: 'warehouseSku',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn title="Name" minWidth="150px" maxWidth="500px"  contentPosition="start"/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="150px" maxWidth="500px"  contentPosition="start"/>
            ),
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px"  contentPosition="center" childrenBefore={<Tooltip title="Available products for new orders"><span>Available</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px"  contentPosition="center"/>
            ),
            dataIndex: 'available',
            key: 'available',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title="Products that were reserved for orders or movements"><span>Reserve</span></Tooltip>}/>,
            render: (text: number, record: ProductStockType) =>  (
                <TableCell minWidth="40px" maxWidth="40px" contentPosition="center"
                    childrenBefore={
                        <Popover
                            content={record.reserved ? <SimplePopup
                                items={getPopupItems(record)}
                                width={200}
                                hasCopyBtn={true}
                                needScroll={true}
                            /> : null}
                            trigger={isTouchDevice ? 'click' : 'hover'}
                            placement="left"
                            overlayClassName="doc-list-popover"
                        >
                            <span style={{width: curWidth}} className="products-cell-style">{text} <Icon
                                name="info"/></span>
                        </Popover>
                    }
                />
            ),
            dataIndex: 'reserved',
            key: 'reserved',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title="Damaged products"><span>Damaged</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'damaged',
            key: 'damaged',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title="Products past usability"><span>Expired</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'expired',
            key: 'expired',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title="Products that are being returned to the warehouse"><span>Returning</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'forPlacement',
            key: 'forPlacement',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title="Products currently in transit in stock movements"><span>On shipping</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'onShipping',
            key: 'onShipping',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['lg'],
        },
        {
            title: <TitleColumn minWidth="40px" maxWidth="40px" contentPosition="center" childrenBefore={<Tooltip title="All stock including all product statuses"><span>Total</span></Tooltip>}/>,
            render: (text: string) => (
                <TableCell value={text} minWidth="40px" maxWidth="40px" contentPosition="center"/>
            ),
            dataIndex: 'total',
            key: 'total',
            sorter: true,
            onHeaderCell: (column: ColumnType<ProductStockType>) => ({
                onClick: () => handleHeaderCellClick(column.dataIndex as keyof ProductStockType),
            }),
            responsive: ['md'],
        },
    ], [handleHeaderCellClick]);

    return (
        <div className='product-stock-list table'>
            <Head>
                <title>Products stock</title>
                <meta name="stock" content="stock" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" type="image/png"/>
            </Head>

            <SearchContainer>
                <Button type="button" disabled={false} onClick={toggleFilters} variant={ButtonVariant.FILTER} icon={'filter'}></Button>
                <div className='search-block'>
                    <SearchField searchTerm={searchTerm} handleChange={handleFilterChange} handleClear={()=>{setSearchTerm(""); handleFilterChange("");}} />
                    <FieldBuilder {...fullTextSearchField} />
                </div>
            </SearchContainer>

            <div className='filter-and-pagination-container'>
                <div className='current-filter-container'>
                    <CurrentFilters title='Warehouse' filterState={filterWarehouse} options={transformedWarehouses} onClose={()=>setFilterWarehouse([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterWarehouse(true)}} />
                    <CurrentFilters title='Country' filterState={filterCountry} options={transformedCountries} onClose={()=>setFilterCountry([])} onClick={()=>{setIsFiltersVisible(true); setIsOpenFilterCountry(true)}} />
                </div>
                <div className="page-size-container">
                    <span className="page-size-text"></span>
                    <PageSizeSelector
                        options={PageOptions}
                        value={pageSize}
                        onChange={(value: number) => handleChangePageSize(value)}
                    />
                </div>
            </div>
            <div className={`card table__container mb-md ${animating ? '' : 'fade-in-down '} ${filteredProducts?.length ? '' : 'is-empty'}`}>
                <Table
                    dataSource={filteredProducts.slice((current - 1) * pageSize, current * pageSize).map(item => ({
                        ...item,
                        key: item.tableKey,
                    }))}
                    columns={columns}
                    pagination={false}
                    scroll={{y:700}}
                    showSorterTooltip={false}
                />
                <div className="order-products-total">
                    <ul className='order-products-total__list'>
                        <li className='order-products-total__list-item'>Total products:<span className='order-products-total__list-item__value'>{filteredProducts.length}</span></li>
                    </ul>
                </div>
            </div>
            <div className={'custom-pagination'}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    onChange={handleChangePage}
                    total={filteredProducts.length}
                    hideOnSinglePage
                    showSizeChanger={false}
                />
            </div>

            <FiltersContainer isFiltersVisible={isFiltersVisible} setIsFiltersVisible={setIsFiltersVisible} onClearFilters={handleClearAllFilters}>
                <FiltersBlock filterTitle='Warehouse' filterOptions={transformedWarehouses} filterState={filterWarehouse} setFilterState={setFilterWarehouse} isOpen={isOpenFilterWarehouse} setIsOpen={setIsOpenFilterWarehouse}/>
                <FiltersBlock filterTitle='Country' isCountry={true} filterOptions={transformedCountries} filterState={filterCountry} setFilterState={setFilterCountry} isOpen={isOpenFilterCountry} setIsOpen={setIsOpenFilterCountry}/>
            </FiltersContainer>
        </div>
    );
};

export default React.memo(ProductList);