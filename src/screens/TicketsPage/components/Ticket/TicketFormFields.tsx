import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";

export const CreateTicketFields = (t, requiredFieldMessage:string, topicOptions: OptionType[], subjectUuid: string|null) => {

    return [
        {
            fieldType: FormFieldTypes.SELECT,
            type: "text",
            name: 'topic',
            label: t('topic'),
            options: topicOptions,
            placeholder: "",
            width: WidthType.w50,
            classNames: "",
            rules: {
                required: requiredFieldMessage,
            },
            hint: t('topicHint'),
        },
        {
            fieldType: FormFieldTypes.TEXT,
            type: "text",
            name: 'subject',
            label: t('title'),
            placeholder: "",
            width: WidthType.w50,
            classNames: "",
            rows: 1,
            rules: subjectUuid ? false :{
                required: requiredFieldMessage,
            },
            disabled: !!subjectUuid,
            hint: t('titleHint'),
        },
        {
            fieldType: FormFieldTypes.TEXT_AREA,
            type: "text",
            name: 'description',
            label: t('description'),
            placeholder: "",
            width: WidthType.w100,
            classNames: "",
            rows: 3,
            rules: {
                required: requiredFieldMessage,
            },
            hint: t('descriptionHint'),
        },

    ];
}


