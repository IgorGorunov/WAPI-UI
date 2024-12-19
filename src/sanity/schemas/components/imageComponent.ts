import { defineType } from 'sanity';
import { FaRegImage } from "react-icons/fa";

export const imageComponent = defineType({
    name: 'imageComponent',
    title: 'Image component',
    type: 'document',
    icon: FaRegImage,
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true }, // Enables hotspot and focal point for image cropping
        },
        {
            name: 'alt',
            title: 'Alternative Text',
            type: 'string',
            description: 'Describes the image for accessibility and SEO purposes',
            validation: (Rule) => Rule.required().error('Alternative text is required for accessibility.'),
        },
        {
            name: 'caption',
            title: 'Caption',
            type: 'string',
            description: 'Optional caption displayed below the image',
        },
    ],
});

export default imageComponent;