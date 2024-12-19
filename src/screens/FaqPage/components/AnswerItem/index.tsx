import React, {memo} from "react";
import SanityBlockRenderer from "@/components/SanityBlockRenderer";
import {FaqPageContentItemType} from "@/types/sanity/fragmentTypes";

type FaqAnswerItemPropsType = {
    item: FaqPageContentItemType;
    setRef: (anchorId: string) => (element: HTMLElement | null) => void;
    level?: number;
}

const AnswerItem: React.FC<FaqAnswerItemPropsType> = ({ item, setRef, level =0 }) => {
    return (
        <section id={item.anchorId} ref={setRef(item.anchorId)}>
            {'questionGroupText' in item && (
                <h2 className={`faq-answers__list-item is-group content-item-level-${level}`}>
                    {item.questionGroupText}
                </h2>)
            }
            {'question' in item && (
                <h3 className='faq-answers__question'>
                    <span className="qa-icon q-icon">Q:</span>
                    {item.question}
                </h3>)
            }
            {'answer' in item && (
                <ul className={`faq-answers__answer faq-answers__list`}>
                    <span className="qa-icon a-icon">A:</span>{item.answer && item.answer.length ?
                    item.answer.map((item, index) => <div
                        key={'_id' in item ? item._id as string : `pt-${index}`}
                        className='sanity-component-wrapper'>
                        <SanityBlockRenderer block={item}/>
                    </div>)
                    : null
                }
                </ul>)}
            {'questions' in item && (
                <div className={`faq-answers__subquestions`}>
                    {item.questions.map((subItem) => (
                        <AnswerItem key={subItem._id} item={subItem} setRef={setRef} level={level + 1}/>
                    ))}
                </div>
            )}
        </section>
    );
};

export default memo(AnswerItem);