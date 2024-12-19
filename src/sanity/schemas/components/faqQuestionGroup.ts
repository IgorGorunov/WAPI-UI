import { v4 as uuidv4 } from 'uuid';
import {FaRegObjectGroup} from "react-icons/fa";

const questionGroup = {
    name: 'faqQuestionGroup',
    title: 'Question Group',
    type: 'document',
    icon: FaRegObjectGroup,
    fields: [
        {
            name: 'title',
            title: 'Group Title (for technical use)',
            type: 'string',
        },
        {
            name: 'questionGroupText',
            title: 'Group Title (for display on page)',
            type: 'string',
            description: 'The title of this question group, displayed as an anchor link.',
            validation: Rule => Rule.required().error('Title is required')
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
            name: 'questions',
            title: 'Questions',
            type: 'array',
            of: [
                { type: 'reference',
                    to: [
                        { type: 'faqQuestionGroup' },
                        { type: 'faqItem' },
                    ]
                },
            ],
            description: 'List of questions in this group'
        }
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'anchorId',
        },
        prepare(selection: { title: string; subtitle: string }) {
            return {
                title: `${selection.title}`,
                subtitle: `Question group`
            };
        }
    }
};

export default questionGroup;