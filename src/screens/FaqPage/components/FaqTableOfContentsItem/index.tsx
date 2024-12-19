import {FaqPageContentItemType} from "@/types/sanity/fragmentTypes";
import React, {memo} from "react";
import FaqTableOfContents from "@/screens/FaqPage/components/FaqTableOfContents";
import '../../styles.scss';

type FaqTableOfContentsItemPropsType = {
    faqBlock: FaqPageContentItemType;
    level: number;
    onClick: (id: string) => void;
}

const FaqTableOfContentsItem: React.FC<FaqTableOfContentsItemPropsType> = ({faqBlock, level, onClick}) => {

    return (
        <>
            <a className={`faq-table-of-contents__list-item ${faqBlock._type} ${faqBlock._type == 'faqQuestionGroup' ? 'content-item-level-'+level : ''}`} onClick={()=>onClick(faqBlock.anchorId)}>
                {'question' in faqBlock ? faqBlock.question : 'questionGroupText' in faqBlock ? faqBlock.questionGroupText : '--'}

            </a>
            {'questions' in faqBlock ? (
                <FaqTableOfContents content={faqBlock.questions} level={level+1} onClick={onClick} />
            ) : null}
        </>
    )

}

export default  memo(FaqTableOfContentsItem);