import {BsTable} from "react-icons/bs";

export default {
    name: 'tableComponent',
    title: 'Table component',
    type: 'document',
    icon: BsTable,
    fields: [
        {
            name: 'title',
            title: 'Title',
            description: 'for tecnical use',
            type: 'string',
        },
        {
            name: 'heading',
            title: 'Heading (optional)',
            description: 'if filled, will be rendered above the table as h3 heading',
            type: 'string',
        },
        {
            name: 'table',
            title: 'Table',
            type: 'table',
        },
        {
            name: 'isFirstRowAHeader',
            title: 'Is first row a header?',
            description: 'Switch to true is you want the first row to be styled as a header',
            type: 'boolean',
            value: false,
        },
        {
            name: 'isFirstColumnAHeader',
            title: 'Is first column a header?',
            description: 'Switch to true is you want the first column to be styled as a header',
            type: 'boolean',
            value: false,
        },
    ],

}