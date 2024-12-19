import {BsReverseLayoutTextWindowReverse} from "react-icons/bs";

export default {
    name: 'documentationPage',
    title: 'Page for documentation',
    type: 'document',
    icon: BsReverseLayoutTextWindowReverse,
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
        {
            name: "heading",
            title: "Heading (optional)",
            type: "string"
        },
        {
            name: 'content',
            title: 'Page content',
            type: 'array',
            of: [
                { type: 'reference',
                    to: [
                        { type: 'textComponent' },
                        { type: 'imageComponent' },
                        { type: 'tableComponent' },
                        { type: 'videoComponent' },
                        { type: 'downloadableFile' },
                    ]
                },
            ],
        }
    ]
}