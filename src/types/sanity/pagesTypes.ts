import {
    FaqPageContentItemType,
    ImageComponentType,
    TableComponentType,
    TextComponentType
} from "@/types/sanity/fragmentTypes";

export type DocumentationPageContentType = Array<TextComponentType | ImageComponentType | TableComponentType>;

export type DocumentationPageType = {
    _id: string;
    title: string;
    heading: string;
    slug: string;
    content: DocumentationPageContentType;
}

export type FaqPageType = {
    _id: string;
    title: string;
    // heading: string;
    slug: string;
    content: FaqPageContentItemType[];
}