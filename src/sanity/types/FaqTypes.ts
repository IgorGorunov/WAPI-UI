import { PortableTextBlock } from "sanity";

// export type Project = {
//     _id: string;
//     createdAt: Date;
//     name: string;
//     slug: string;
//     image: string;
//     url: string;
//     content: PortableTextBlock[];
// }

// export type FaqAnswerType = {
//     _type: PortableTextBlock | 'image' | 'file' | 'videoEmbed';
//     children?: { text: string }[]; // For rich text blocks
//     asset?: { _ref: string }; // For images and files
//     url?: string; // For video embed URLs
// }

export interface AnswerBlock {
    _type: 'block' | 'image' | 'file' | 'videoEmbed';
}

export interface ImageBlock extends AnswerBlock {
    _type: 'image';
    asset: {
        _ref: string;
    };
}

export interface FileBlock extends AnswerBlock {
    _type: 'file';
    asset: {
        _ref: string;
    };
}

export interface VideoEmbedBlock extends AnswerBlock {
    _type: 'videoEmbed';
    url: string;
}

//export type RichTextType = PortableTextBlock | ImageBlock | FileBlock | VideoEmbedBlock;

export type FaqAnswerType = PortableTextBlock | ImageBlock | FileBlock | VideoEmbedBlock;

export type FaqItemType = {
    _id: string; // Unique identifier for each item (provided by Sanity)
    title: string;
    slug: {
        _type: 'slug';
        current: string;
    };
    question: string;
    answer: FaqAnswerType[];
}

export type FaqBlockType = {
    _id: string; // Unique identifier for each item (provided by Sanity)
    title: string;
    slug: {
        _type: 'slug';
        current: string;
    };
    heading: string;
    faqItems: FaqItemType[];
}