import React from 'react';
import {DownloadableFileType, RichTextType, VideoComponentType} from "@/types/sanity/fragmentTypes";
import { PortableText, PortableTextComponents } from '@portabletext/react';
import './styles.scss';
import ImageComponent from "@/components/ImageComponent";
import TableComponent from "../TableComponent";
import {PAGE_REFERENCES} from "@/types/sanity/pageReferences";
import VideoComponent from "@/components/VideoComponent";
import DownloadableFile from "@/components/DownloadableFile";

type FaqItemPropsType = {
    textContent: RichTextType;
}


const TextComponent: React.FC<FaqItemPropsType> = (props) => {

    const components: PortableTextComponents = {
        types: {
            h1: (props: any) => <h1 className="text-h1" {...props} />,
            h2: (props: any) => <h2 className="text-h2" {...props} />,
            // Render image components within text content
            imageComponent: ({ value }) => {
                return (
                    <ImageComponent
                        imageUrl={value.imageUrl}
                        alt={value.alt}
                        caption={value.caption}
                    />
                )
            },
            table: ({value})=> (
                <TableComponent
                    table={value.table}
                    isFirstRowAHeader={value.isFirstRowAHeader}
                    isFirstColumnAHeader={value.isFirstColumnAHeader}
                />
            ),
            videoComponent: ({ value }: {value: VideoComponentType}) => {
                return (
                    <VideoComponent {...value} />
                )
            },
            downloadableFile: ({value}: {value: DownloadableFileType}) => {
                return (
                    <DownloadableFile {...value} />
                )
            }
        },
        list: {
            bullet: ({children}) => <ul className="list-disc">{children}</ul>,
            number: ({children}) => <ol className="list-decimal">{children}</ol>,
        },
        listItem: {
            bullet: ({children }) => <li className="list-item">{children}</li>,
            number: ({ children }) => <li className="list-item">{children}</li>,
        },
        marks: {
            link: ({ children, value }: { children: React.ReactNode; value?: { url: string } }) => {
                return (
                    <a href={value?.url} className="is-link external-link">
                        {children}
                    </a>
                )
            },
            internalLink: ({ children, value }: { children: React.ReactNode; value?: { referenceType: string, referenceSlug: string } }) => {
                return (
                    <a href={`/${PAGE_REFERENCES[value.referenceType]}/${value.referenceSlug}`} className="is-link internal-link">
                        {children}
                    </a>
                )
            },
        },
    };

    return (
        <div className="rich-text">
            <PortableText value={props.textContent} components={components} />
        </div>
    );
};

export default TextComponent;