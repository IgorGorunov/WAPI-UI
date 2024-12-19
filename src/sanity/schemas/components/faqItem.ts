import { v4 as uuidv4 } from 'uuid';
import {MdOutlineQuestionAnswer} from "react-icons/md";

const questionGroup = {
    name: 'faqItem',
    title: 'FAQ Item',
    type: 'document',
    icon: MdOutlineQuestionAnswer,
    fields: [
        {
            name: 'question',
            title: 'Question',
            type: 'string',
            description: 'Question text to be displayed both in table on contents and as a question',
            validation: Rule => Rule.required().error('Question is required')
        },
        {
            name: 'anchorId',
            title: 'Anchor ID',
            type: 'string',
            description: 'Unique identifier for anchor link. Generated automatically.',
            initialValue: () => uuidv4(),
            readOnly: true
        },
        {
            name: 'answer',
            title: 'answer',
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
    ],
    preview: {
        select: {
            title: 'question',
            subtitle: 'anchorId',
        },
        prepare(selection: { title: string; subtitle: string }) {
            return {
                title: `${selection.title}`,
                subtitle: `FAQ Item (question and answer)`
            };
        }
    }
};

export default questionGroup;