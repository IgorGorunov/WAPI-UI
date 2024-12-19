import {FiDownload} from "react-icons/fi";

const downloadableFile = {
    name: "downloadableFile",
    title: "File (for download by users)",
    type: "document",
    icon: FiDownload,
    fields: [
        {
            name:'title',
            title: 'Title (for technical use)',
            type: 'string',
        },
        {
            name: 'label',
            title: 'Label text',
            description: 'Is a text, that user needs to click on to download file.',
            type: 'string',
            validation: Rule => Rule.required().error('Label is required')
        },
        {
            name: 'file',
            title: 'File',
            type: 'file',
            description: 'File that will be available for download',
            validation: Rule => Rule.required().error('File is required')
        }
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'label',
        },
        prepare(selection: { title: string; subtitle: string }) {
            const { title, subtitle } = selection;
            return {
                title: title,
                subtitle: `Label: ${subtitle || 'No label'}`,
                media: FiDownload
            };
        }
    }
}

export default  downloadableFile;