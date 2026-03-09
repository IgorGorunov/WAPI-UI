import React from 'react';
import TextComponent from '../TextComponent';
import ImageBlock from '../ImageComponent';
import TableBlock from '../TableComponent';
import VideoComponent from "../VideoComponent";
import DownloadableFile from "@/components/DownloadableFile";

type SanityBlock = {
    _type: string;
    [key: string]: unknown;
};

const componentsMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
    textComponent: TextComponent,
    imageComponent: ImageBlock,
    tableComponent: TableBlock,
    videoComponent: VideoComponent,
    downloadableFile: DownloadableFile,
};

const BlockRenderer: React.FC<{ block: SanityBlock }> = ({ block }) => {
    const Component = componentsMap[block._type];

    if (!Component) {
        console.warn(`No component found for block type: ${block._type}`);
        return null;
    }

    return <Component {...block} />;
};

export default BlockRenderer;