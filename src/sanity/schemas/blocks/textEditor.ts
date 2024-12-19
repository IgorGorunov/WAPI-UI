import ExternalLinkRenderer from "@/sanity/schemas/sanityComponents/ExternalLinkRenderer";
import {FaRegImage} from "react-icons/fa";
import {GoVideo} from "react-icons/go";
import {FiDownload} from "react-icons/fi";
import {BsTable} from "react-icons/bs";

const textEditor = {
    name: 'textEditor',
    title: 'Text block',
    type: 'array',
    of: [
        { type: 'block',
            marks: {
                annotations: [
                    {
                        name: 'link',
                        type: 'object',
                        title: 'External link',
                        fields: [
                            {
                                name: 'url',
                                type: 'url'
                            }
                        ],
                        components: {
                            annotation: ExternalLinkRenderer
                        }
                    },
                    {
                        name: 'internalLink',
                        type: 'object',
                        title: 'Internal link',
                        //icon: UserIcon,
                        fields: [
                            {
                                name: 'reference',
                                type: 'reference',
                                to: [
                                    { type: 'documentationPage' }
                                    // other types you may want to link to
                                ]
                            },
                        ]
                    },
                ]
            }
        },
        { type: 'imageComponent', title: 'Image', icon: FaRegImage },
        {
            type: 'videoComponent',
            title: 'Video',
            icon: GoVideo,
            name: 'videoComponent',
        },
        {
            type: 'tableComponent',
            name: 'table',
            title: 'Table',
            icon: BsTable,
        },
        {
            type: 'reference',
            name: 'downloadableFileBlock',
            title: 'Downloadable File',
            to: [{ type: 'downloadableFile' }],
            icon: FiDownload,
        }

    ],
    validation: Rule => Rule.required(),
}

export default textEditor;
