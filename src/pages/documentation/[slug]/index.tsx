import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {createClient} from "next-sanity";
import clientConfig from "@/sanity/config/client-config";
import {
    downloadableFileFields,
    imageComponentFields,
    tableComponentFields,
    textComponentFields,
    videoComponentFields
} from "@/sanity/fragments";
import DocumentationPage from "@/screens/DocumentationPage";
import {DocumentationPageType} from "@/types/sanity/pagesTypes";

// Fetch the paths for static generation
export const getStaticPaths: GetStaticPaths = async () => {
    const query = `*[_type == "documentationPage"]{ "slug": slug.current }`;
    const slugs = await createClient(clientConfig).fetch(query);

    const paths = slugs.map((doc: { slug: string }) => ({
        params: { slug: doc.slug },
    }));

    return { paths, fallback: 'blocking' };
};

// Fetch the data for each documentation page
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;

    const query = `
    *[_type == "documentationPage" && slug.current == $slug][0]{
      _id,
      title,
      heading,
      slug,
      content[]{
        ...,
        _type == "reference" => @->{
          ${textComponentFields},
          ${tableComponentFields},
          ${imageComponentFields},
          ${videoComponentFields},
          ${downloadableFileFields},
        }
      }
    }
  `;

    const pageData: DocumentationPageType = await createClient(clientConfig).fetch(query, { slug });

    if (!pageData) {
        return { notFound: true };
    }

    return {
        props: { pageData }
    };
};

// Define the Documentation Page component
const Documentation = ({ pageData }: { pageData: DocumentationPageType }) => {
    const router = useRouter();

    console.log('Doc page:', pageData);

    // Display loading state while fallback renders
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const { heading, content } = pageData;

    console.log('content: ', content);

    return (
        <DocumentationPage heading={heading} content={content}/>
    );
};

export default Documentation;