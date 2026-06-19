// import React, {useEffect, useState} from 'react';
// import {Checkbox, Input, Table} from "antd";
// import {Controller} from "react-hook-form";
// import {UnitOfMeasuresType} from "@/types/products";
// import Button from "@/components/Button/Button";
//
// type UnitOfMeasuresTableType = UnitOfMeasuresType & {
//     selected: boolean;
// }
// type DimensionsTableType = {
//     unitOfMeasures: UnitOfMeasuresTableType[];
//     setValue: (name: string, value: any)=>void;
//     control: any;
//     append: (data: UnitOfMeasuresTableType)=>void;
//     getValues: (name: string)=>UnitOfMeasuresTableType[];
// }
// const DimensionsTable: React.FC<DimensionsTableType> = ({unitOfMeasures, setValue, control, append, getValues}) => {
//     const [unitOfMeasureOptions, setUnitOfMeasureOptions] = useState<string[]>([]);
//
//     const getOptions = () => {
//         // Extract names from unitOfMeasures array
//         return unitOfMeasureOptions.map((item) => ({ value: item, label: item }));
//     };
//
//     useEffect(() => {
//         // Update the select options when the unitOfMeasures array changes
//         const names = unitOfMeasures.map((row) => row.name);
//         setUnitOfMeasureOptions(names);
//     }, [unitOfMeasures, setUnitOfMeasureOptions]);
//
//     const [selectAll, setSelectAll] = useState(false);
//
//     const getColumns = (control: any) => [
//         {
//             title: (
//                 <Checkbox
//                     onChange={(e) => {
//                         setSelectAll(e.target.checked);
//
//                         // Update the values of all checkboxes in the form when "Select All" is clicked
//                         const values = getValues();
//                         const fields = values.unitOfMeasures;
//                         fields &&
//                         fields.forEach((field, index) => {
//                             setValue(`unitOfMeasures.${index}.selected`, e.target.checked);
//                         });
//                     }}
//                 >
//                     Select All
//                 </Checkbox>
//             ),
//             dataIndex: 'selected',
//             key: 'selected',
//             render: (text, record, index) => (
//                 <Controller
//                     name={`unitOfMeasures[${index}].selected`}
//                     control={control}
//                     render={({ field }) => (
//                         <Checkbox
//                             {...field}
//                             checked={field.value || selectAll}
//                         />
//                     )}
//                 />
//             ),
//         },
//         {
//             title: 'Unit Name',
//             dataIndex: 'unitName',
//             key: 'unitName',
//             render: (text, record, index) => (
//                 <Controller
//                     name={`unitOfMeasures[${index}].name`}
//                     control={control}
//                     render={({ field }) => (
//                         <div>
//                             <Input type="text" value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}/>
//                         </div>
//                     )}
//                 />
//             ),
//         },
//         {
//             title: 'Unit Width',
//             dataIndex: 'unitWidth',
//             key: 'unitWidth',
//             render: (text, record, index) => (
//                 <Controller
//                     name={`unitOfMeasures[${index}].width`}
//                     control={control}
//                     render={({ field }) => (
//                         <div>
//                             <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}/>
//                         </div>
//                     )}
//                 />
//             ),
//         },
//         {
//             title: 'Unit Length',
//             dataIndex: 'unitLength',
//             key: 'unitLength',
//             render: (text, record, index) => (
//                 <Controller
//                     name={`unitOfMeasures[${index}].length`}
//                     control={control}
//                     render={({ field }) => (
//                         <div>
//                             <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}/>
//                         </div>
//                     )}
//                 />
//             ),
//         },
//     ];
//
//     const removeDimensions = () => {
//         setValue('unitOfMeasures', unitOfMeasures.filter(item => !item.selected));
//     }
//
//
//     return <>
//         <div className='product-info--unitOfMeasures-table-btns'>
//             <Button type="button" icon='remove' iconOnTheRight onClick={removeDimensions}>
//                 Remove
//             </Button>
//             <Button type="button" icon='add' iconOnTheRight onClick={() => append({ selected: false, name: '', width: '', length: '' })}>
//                 Add
//             </Button>
//         </div>
//         <Table
//             columns={getColumns(control)}
//             dataSource={getValues('unitOfMeasures')?.map((field, index) => ({ key: index, ...field })) || []}
//             pagination={false}
//             rowKey="key"
//         />
//     </>
// }
//
// export default DimensionsTable;