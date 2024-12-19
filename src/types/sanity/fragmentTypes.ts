import {PortableTextBlock} from "sanity";

export type ImageComponentType = {
    _id: string;
    _type: string;
    imageUrl: string;
    alt: string;
    caption?: string;
}

export type VideoFileBlockType = {
    _id: string;
    _type: string;
    heading?: string;
    mimeType: string;
    videoUrl: string;
}


export type TableRowType = {
    cells: string[];
}

export type TableType = {
    rows: TableRowType[];
}

export type TableComponentType = {
    _id: string;
    _type: string;
    heading: string;
    table: TableType;
    isFirstRowAHeader: boolean;
    isFirstColumnAHeader: boolean;
}

export type VideoLinkBlockType = {
    _id: string;
    _type: string;
    videoUrl: string
}

export type VideoComponentType = {
    _id: string;
    _type: string;
    heading?: string | null;
    videoSource: string;
    videoUrl: string | null;
    videoFileUrl: string | null;
    mimeType: string | null;
}

export type DownloadableFileType = {
    _id: string;
    _type: string;
    fileLabel: string;
    fileUrl: string;
    fileMimeType: string;
}

export type RichTextType = PortableTextBlock | ImageComponentType | VideoComponentType | TableComponentType | DownloadableFileType;



export type TextComponentType = {
    _id: string;
    _type: 'textComponent';
    title: string;
    textContent: Array<
        | PortableTextBlock
        | ImageComponentType
        | VideoComponentType
        | TableComponentType
        | DownloadableFileType
    >;
}

export type FaqItemType = {
    _id: string;
    _type: string;
    question: string;
    anchorId: string;
    answer: Array<
        | PortableTextBlock
        | ImageComponentType
        | VideoComponentType
        | TableComponentType
        | DownloadableFileType
    >;
}

export type FaqPageContentItemType = FaqItemType | FaqQuestionGroupType;


export type FaqQuestionGroupType = {
    _id: string;
    _type: string;
    title: string;
    questionGroupText: string;
    anchorId: string;
    questions: FaqPageContentItemType[];
}
