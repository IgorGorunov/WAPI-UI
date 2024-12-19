import {FiFileText} from "react-icons/fi";

export default {
    name: 'textComponent',
    title: 'Text editor component',
    type: 'document',
    icon: FiFileText,
    fields: [
        {
            name: 'Title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'Text',
            title: 'Text editor',
            type: 'textEditor',
        },
    ]
}