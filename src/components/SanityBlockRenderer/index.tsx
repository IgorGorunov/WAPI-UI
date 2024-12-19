import React from 'react';
import TextComponent from '../TextComponent';
import ImageBlock from '../ImageComponent';
import TableBlock from '../TableComponent';
import VideoComponent from "../VideoComponent";
import DownloadableFile from "@/components/DownloadableFile";

const componentsMap: { [key: string]: React.ComponentType<any> } = {
    textComponent: TextComponent,
    imageComponent: ImageBlock,
    tableComponent: TableBlock,
    videoComponent: VideoComponent,
    downloadableFile: DownloadableFile,
};

const BlockRenderer: React.FC<{ block: any }> = ({ block }) => {
    const Component = componentsMap[block._type];

    if (!Component) {
        console.warn(`No component found for block type: ${block._type}`);
        return null;
    }

    return <Component {...block} />;
};

export default BlockRenderer;