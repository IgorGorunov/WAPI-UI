import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const CreateTicketFields = (topicOptions: OptionType[], subjectUuid: string|null) => {
    console.log('subjectUuid', subjectUuid)
    return [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'topic',
            label: "Topic",
            options: topicOptions,
            placeholder: "",
            width: WidthType.w50,
            classNames: "",
            rules: {
                required: "Required field",
            },
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'subject',
            label: "Title",
            placeholder: "",
            width: WidthType.w50,
            classNames: "",
            rows: 1,
            rules: subjectUuid ? false :{
                required: "Required field",
            },
            disabled: !!subjectUuid,
        },
        {
            fieldType: FormFieldTypes.TEXT_AREA,
            type: "text",
            name: 'description',
            label: "Ticket description",
            placeholder: "",
            width: WidthType.w100,
            classNames: "",
            rows: 3,
            rules: {
                required: "Required field",
            },
        },

    ];
}


