import React, {memo,  useRef} from 'react';
import {FaqPageContentItemType} from "@/types/sanity/fragmentTypes";
import '../../styles.scss';
import AnswerItem from "@/screens/FaqPage/components/AnswerItem";


type FaqAnswersBlockPropsType = {
    content: FaqPageContentItemType[];
    onClick: (id: string) => void;
    level?: number;
}

const AnswersBlock: React.FC<FaqAnswersBlockPropsType> = ({ content, level=0 }) => {
    const answerRefs = useRef<Record<string, HTMLElement | null>>({});

    const setRef = (anchorId: string) => (element: HTMLElement | null) => {
        answerRefs.current[anchorId] = element;
    };

    return (
        <div className={`faq-answers__wrapper`}>
            {content.map((item) => (
                <AnswerItem key={item._id} item={item} setRef={setRef} level={level}/>
            ))}
        </div>
    );
};

export default memo(AnswersBlock);