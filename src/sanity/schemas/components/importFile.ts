import {FaFileImport} from "react-icons/fa";

const importFile = {
    name: "importFile",
    title: "Template files (Master data, etc.)",
    type: "document",
    icon: FaFileImport,
    fields: [
        {
            name:'title',
            title: 'Title (for technical use)',
            type: 'string',
        },
        {
            name: 'templateName',
            type: 'string',
            title: 'Type of template (template so user can import data into UI in bulk)',
            description: "NOTE: if you need to add, remove or move columns in import template -- check with 1C team beforehand !!!",
            options: {
                list: [
                    { title: 'Master data (upload products)', value: 'masterData' },
                    { title: 'Order template (upload the orders in bulk)', value: 'orderTemplate' },
                    { title: 'Stock-movement products template (import products into Stock-movement documents)', value: 'productsImport' },
                    { title: 'Contract sample for self-serv (for user information, is not imported into UI)', value: 'contract' },
                ],
                layout: 'radio',
            },
            initialValue: 'masterData',
        },
        {
            name: 'file',
            title: 'File',
            type: 'file',
            description: 'File that will be available for download',
            validation: Rule => Rule.required().error('File is required')
        }
    ],
}

export default  importFile;