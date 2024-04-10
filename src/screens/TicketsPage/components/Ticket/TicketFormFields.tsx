import {FormFieldTypes, OptionType, WidthType} from "@/types/forms";
import {TicketHints} from "@/screens/TicketsPage/ticketHints.constants";

export const CreateTicketFields = (topicOptions: OptionType[], subjectUuid: string|null) => {

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
            hint: TicketHints['topic'] || '',
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
            hint: TicketHints['subject'] || '',
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
            hint: TicketHints['description'] || '',
        },

    ];
}


