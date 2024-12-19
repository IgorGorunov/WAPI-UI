// Fragment for imageComponent
export const imageComponentFields = `
  _type == "imageComponent" => {
    ...,
    _type,
    _key,
    _id,
    title,
    alt,
    caption,
    "imageUrl": image.asset->url,
  }
`;

export const videoFileBlockFields = `
  _type == "videoFileBlock" => {
    _id,
    _type,
    "heading": heading,              // Retrieves the optional heading
    "videoUrl": video.asset->url,    // Resolves the URL of the video file
    "mimeType": video.asset->mimeType // Retrieves the MIME type of the video file
  }
`;

export const videoComponentFields = `
  _type == "videoComponent" => {
    ...,
    _id,
    _type,
    videoSource,
    videoUrl,
    videoSource,
    heading,
    "videoFileUrl": videoFile.asset->url,    // Resolves the URL of the video file
    "mimeType": videoFile.asset->mimeType // Retrieves the MIME type of the video file
  }
`;

export const downloadableFileFields = `
  _type == "downloadableFile" => {
    ...,
    _type,
    _id,
    title,
    "fileLabel": label,
    "fileUrl": file.asset->url,
    "fileMimeType": file.asset->mimeType
  }
`;

// Fragment for textComponent
export const textComponentFields = `
 _type == "textComponent" => {
    _type,
    _key,
    _id,
    "title": Title,
    "textContent": Text[]{
      ...,
      // Use imageComponentFields fragment for images within text content
      ${imageComponentFields},
      // Video file with URL
      ${videoComponentFields},
      // Video embed URL
      _type == "videoEmbed" => {
        _type,
        url
      },
      // Resolve internal and external links
      markDefs[]{
        ...,
        _type == "link" => { _type, url },
        _type == "internalLink" => {
          _type,
          "referenceSlug": reference->slug.current,
          "referenceType": reference->_type
        }
      },
      // Downloadable File Block
      _type == "downloadableFileBlock" => @-> {
        ${downloadableFileFields}
      }
    }
  }
`;



// Fragment for tableComponent
export const tableComponentFields = `
  _type == "tableComponent" => {
    ...,
    _type,
    _key,
    _id,
    heading,
    title,
    table,
    isFirstRowAHeader,
    isFirstColumnAHeader
  }
`;

export const faqItemFields = `
  _type == 'faqItem' => {
    
    ...,
    _type,
    _id,
    question,
    anchorId,
    answer[]{
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

export const faqQuestionGroupFields = (level: number) => {
    if (level > 4) return '';

    return `
  _type == "faqQuestionGroup" => {
    ...,
    _type,
    _id,
    title,
    questionGroupText,
    anchorId,
    questions[]{
      _type == "reference" => @->{
        ${faqItemFields},
        ${faqQuestionGroupFields(level+1)}
      }
    }
  }
`};

