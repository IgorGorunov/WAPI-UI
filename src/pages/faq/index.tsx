import React from 'react';
import {faqItemFields, faqQuestionGroupFields} from "@/sanity/fragments";
import {FaqPageType} from "@/types/sanity/pagesTypes";
import FaqPageScreen from '@/screens/FaqPage';
import AuthChecker from "@/components/AuthChecker";
import {client} from "@/sanity/sanity-utils";


const FaqPage = ({ faqPageData }: { faqPageData: FaqPageType}) => {
    return (
        <AuthChecker isUser={true}>
            <FaqPageScreen {...faqPageData} />
        </AuthChecker>
    );
};


// Fetch the FAQ block data from Sanity
export async function getServerSideProps() {

    try {
        const query = `
          *[_type == "faqPage"][0]{
            title,
            "content": content[] {
              ...,
              _type == "reference" => @->{
                ${faqQuestionGroupFields(0)},
                ${faqItemFields},
              }
            }
          }
        `;
        const faqPageData: FaqPageType = await client.fetch(query);

        return {
            props: {
                faqPageData,
            },
        };

    } catch (error) {
        console.error("FAQ fetch error:", error);
        return {
            notFound: true
        };
    }

}

export default FaqPage;