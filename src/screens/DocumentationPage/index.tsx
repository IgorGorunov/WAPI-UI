import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Header from "@/components/Header";
import SanityBlockRenderer from "@/components/SanityBlockRenderer";
import {DocumentationPageContentType} from "@/types/sanity/pagesTypes";


type DocumentationPagePropsType = {
    heading?: string;
    content: DocumentationPageContentType;
}

const DocumentationPage:React.FC<DocumentationPagePropsType> = (props) => {
    const {heading, content} = props;

    return (
        <Layout hasHeader hasFooter>
            <div className="page-container documentation-page">
                <Header pageTitle='Documentation' toRight />
                <div className="documentation-page__container">
                    <h2>{heading}</h2>
                    {content && content.length ?
                        content.map(item => <div key={item._id} className='sanity-component-wrapper'>
                            <SanityBlockRenderer block={item} />
                        </div>)
                    : null}
                </div>
            </div>
        </Layout>
    );
};

export default DocumentationPage;
