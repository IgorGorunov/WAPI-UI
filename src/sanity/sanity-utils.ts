import { createClient } from "next-sanity";
import { FaqBlockType } from "./types/FaqTypes";
import clientConfig from './config/client-config'
import {imageComponentFields, tableComponentFields, textComponentFields} from "@/sanity/fragments";

export async function getImportTemplate(templateName: string) {
    const query = `
        *[_type == "importFile" && templateName == $templateName][0]{
            ...,
            title,
            templateName,
            "fileUrl": file.asset->url
        }
    `;
    const params = { templateName };

    try {
        return await createClient(clientConfig).fetch<any>(query, params);
    } catch (error) {
        console.error('Error fetching FAQ block:', error);
        return null;
    }
}

export async function getFaqBlock(): Promise<FaqBlockType | null> {
    const query = `*[_type == "faqBlock"][0]{
    _id,
    title,
    slug,
    heading,
    faqItems[]->{
      _id,
      title,
      slug,
      question,
      answer[]{
        ...,
        asset->{_id, url}  // Fetch asset details for images and files
      }
    }
  }`;

    try {
        const faqBlock = await createClient(clientConfig).fetch<any>(query);
        console.log('res: ', faqBlock)
        return faqBlock;
    } catch (error) {
        console.error('Error fetching FAQ block:', error);
        return null;
    }
}

export async function getDocumentationPage(slug: string) {
    const query = `
    *[_type == "documentationPage" && slug.current == $slug][0]{
      title,
      heading,
      slug,
      content[]{
        ...,
        _type == "reference" => @->{
          ${textComponentFields},
          ${imageComponentFields},
          ${tableComponentFields}
        }
      }
    }
  `;

    const params = { slug };

    try {
        const result = await createClient(clientConfig).fetch(query, params);
        console.log('res docPage: ', result)
        return result;
    } catch (error) {
        console.error('Error fetching Doc Page:', error);
        return null;
    }
}



// export async function getFaqBlock(slug: string): Promise<FaqBlockType | null> {
//     const query = `*[_type == "faqBlock"][0]{
//     _id,
//     title,
//     slug,
//     heading,
//     faqItems[]->{
//       _id,
//       title,
//       slug,
//       question,
//       answer[]{
//         ...,
//         asset->{_id, url}  // Fetch asset details for images and files
//       }
//     }
//   }`;
//
//     const params = { slug };
//
//     try {
//         const faqBlock = await createClient(clientConfig).fetch<FaqBlockType>(query, params);
//         return faqBlock;
//     } catch (error) {
//         console.error('Error fetching FAQ block:', error);
//         return null;
//     }
// }

// export async function getProjects(): Promise<Project[]> {
//     return createClient(clientConfig).fetch(
//         groq`*[_type == "project"]{
//       _id,
//       _createdAt,
//       name,
//       "slug": slug.current,
//       "image": image.asset->url,
//       url,
//       content
//     }`
//     )
// }
//
// export async function getProject(slug: string): Promise<Project> {
//     return createClient(clientConfig).fetch(
//         groq`*[_type == "project" && slug.current == $slug][0]{
//       _id,
//       _createdAt,
//       name,
//       "slug": slug.current,
//       "image": image.asset->url,
//       url,
//       content
//     }`,
//         { slug }
//     )
// }