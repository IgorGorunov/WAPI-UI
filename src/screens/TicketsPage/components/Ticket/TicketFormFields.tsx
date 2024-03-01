import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const CreateTicketFields = (topicOptions: OptionType[]) => [
    {
        fieldType: FormFieldTypes.SELECT,
        type: "text",
        name: 'topic',
        label: "Topic",
        options: topicOptions,
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
        rules: {
            required: "Required field",
        },
    },
    {
        fieldType: FormFieldTypes.TEXT_AREA,
        type: "text",
        name: 'subject',
        label: "Subject / Title",
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
        textAriaHeight: 2,
        rules: {
            required: "Required field",
        },
    },
    {
        fieldType: FormFieldTypes.TEXT_AREA,
        type: "text",
        name: 'description',
        label: "Ticket description",
        placeholder: "",
        width: WidthType.w100,
        classNames: "",
        textAriaHeight: 6,
        rules: {
            required: "Required field",
        },
    },

];


