import React from 'react';
import {faqItemFields, faqQuestionGroupFields} from "@/sanity/fragments";
import {createClient} from "next-sanity";
import clientConfig from "@/sanity/config/client-config";
import {FaqPageType} from "@/types/sanity/pagesTypes";
import FaqPageScreen from '@/screens/FaqPage';
import AuthChecker from "@/components/AuthChecker";

const FaqPage = ({ faqPageData }: { faqPageData: FaqPageType}) => {
    return (
        <AuthChecker isUser={true}>
            <FaqPageScreen {...faqPageData} />
        </AuthChecker>
    );
};

// Fetch the FAQ block data from Sanity
export async function getServerSideProps() {

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

    const faqPageData: FaqPageType = await createClient(clientConfig).fetch(query);


    return {
        props: {
            faqPageData,
        },
    };
}

export default FaqPage;