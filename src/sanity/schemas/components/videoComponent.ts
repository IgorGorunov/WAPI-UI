import { GoVideo } from "react-icons/go";

export default {
    name: 'videoComponent',
    title: 'Video component',
    type: 'document',
    icon: GoVideo,
    fields: [
        {
            name: 'title',
            title: 'Title',
            description: 'for technical use',
            type: 'string',
        },
        {
            name: 'heading',
            type: 'string',
            title: 'Heading (optional)',
            description: 'if filled, will be displayed above video player as h3 heading'
        },
        {
            name: 'videoSource',
            type: 'string',
            title: 'Video Source',
            description: 'Choose to either upload a file or provide a URL link.',
            options: {
                list: [
                    { title: 'Upload File', value: 'file' },
                    { title: 'Enter URL', value: 'url' },
                ],
                layout: 'radio', // Display options as radio buttons
            },
            initialValue: 'file', // Set default value, optional
        },
        {
            name: 'videoFile',
            type: 'file',
            title: 'Video file',
            description: 'Upload a video file',
            options: {
                accept: 'video/*'
            },
            hidden: ({ parent }) => parent?.videoSource !== 'file',
            required: ({ parent }) => parent?.videoSource === 'file',
        },
        {
            name: 'videoUrl',
            type: 'url',
            title: 'Video URL',
            description: 'Enter a link to the video (e.g., YouTube, Vimeo)',
            hidden: ({ parent }) => parent?.videoSource !== 'url', // Show only if "Enter URL" is selected
            required: ({ parent }) => parent?.videoSource === 'url',
        },
    ],
}