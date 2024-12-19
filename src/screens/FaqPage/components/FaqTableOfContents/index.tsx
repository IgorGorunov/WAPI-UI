import React, {memo} from 'react';
import {FaqPageContentItemType} from "@/types/sanity/fragmentTypes";
import FaqTableOfContentsItem from "@/screens/FaqPage/components/FaqTableOfContentsItem";
import '../../styles.scss';

type FaqTableOfContentsPropsType = {
    content: FaqPageContentItemType[];
    onClick: (id: string) => void;
    level?: number;
}

const FaqTableOfContents: React.FC<FaqTableOfContentsPropsType> = ({content, onClick, level=0}) => {

    return (
        <>
            {content && content.length ?
                <ul className={`faq-table-of-contents__list ${level > 0 ? 'nested-list' : ''}`}>
                    {content.map((item: FaqPageContentItemType) => (
                        <FaqTableOfContentsItem key={item._id} faqBlock={item} level={level} onClick={onClick}/>
                    ))}
                </ul>
                : null
            }
        </>
    )
}

export default memo(FaqTableOfContents);