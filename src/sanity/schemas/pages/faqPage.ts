import {RiQuestionAnswerLine} from "react-icons/ri";

export default {
    name: 'faqPage',
    title: 'Page for FAQ',
    type: 'document',
    icon: RiQuestionAnswerLine,
    fields: [
        {
            name: "title",
            title: "Title",
            description: 'for technical use',
            type: "string"
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 60 }
        },
        // {
        //     name: "heading",
        //     title: "Heading",
        //     description: 'if filled, will be displayed as h2 heading above the FAQ content',
        //     type: "string"
        // },
        {
            name: 'content',
            title: 'Question Groups and FAQ Items',
            type: 'array',
            of: [
                { type: 'reference',
                    to: [
                        { type: 'faqQuestionGroup' },
                        { type: 'faqItem' },
                    ]
                },
            ],
        }
    ]
}