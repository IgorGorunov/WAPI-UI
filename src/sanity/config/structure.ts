import { VscFileMedia } from 'react-icons/vsc';
import { BsPuzzle, BsReverseLayoutTextWindowReverse, BsTable } from "react-icons/bs";
import { RiQuestionAnswerLine } from "react-icons/ri";
import {FaFileImport, FaRegImages, FaRegObjectGroup} from "react-icons/fa";
import {MdOutlineQuestionAnswer, MdOutlineTextSnippet} from "react-icons/md";
import { GoVideo } from "react-icons/go";
import { FiDownload } from "react-icons/fi";

export const structure = (S) =>
    S.list()
        .title('Content')
        .items([
            S.listItem()
                .title('Pages')
                .icon(VscFileMedia)
                .child(
                    S.list()
                        .title("Page Types")
                        .items([
                            S.listItem()
                                .title("Documentation pages")
                                .icon(BsReverseLayoutTextWindowReverse)
                                .schemaType("documentationPage")
                                .child(S.documentTypeList("documentationPage").title("Documentation Pages")),
                            S.listItem()
                                .title("FAQ pages")
                                .icon(RiQuestionAnswerLine)
                                .schemaType("faqPage")
                                .child(S.documentTypeList("faqPage").title("FAQ Page"))
                        ]),
                ),
            S.listItem()
                .title('Components')
                .icon(BsPuzzle)
                .child(
                    S.list()
                        .title('Component Types')
                        .items([
                            S.listItem()
                                .title("FAQ Question groups")
                                .schemaType("faqQuestionGroup")
                                .icon(FaRegObjectGroup)
                                .child(S.documentTypeList("faqQuestionGroup").title("FAQ Question groups")),
                            S.listItem()
                                .title("FAQ items")
                                .schemaType("faqItem")
                                .icon(MdOutlineQuestionAnswer)
                                .child(S.documentTypeList("faqItem").title("FAQ items")),
                            S.divider(),
                            S.listItem()
                                .title("Text components")
                                .schemaType("textComponent")
                                .icon(MdOutlineTextSnippet)
                                .child(S.documentTypeList("textComponent").title("Text components")),
                            S.listItem()
                                .title("Image components")
                                .icon(FaRegImages)
                                .schemaType("imageComponent")
                                .child(S.documentTypeList("imageComponent").title("Image components")),
                            S.listItem()
                                .title("Table components")
                                .icon(BsTable)
                                .schemaType("tableComponent")
                                .child(S.documentTypeList("tableComponent").title("Table components")),
                            S.listItem()
                                .title("Video components")
                                .icon(GoVideo)
                                .schemaType("videoComponent")
                                .child(S.documentTypeList("videoComponent").title("Video components")),
                            S.listItem()
                                .title("Files (for download)")
                                .icon(FiDownload)
                                .schemaType("downloadableFile")
                                .child(S.documentTypeList("downloadableFile").title("Files (for download)")),
                        ]),
                ),
            S.listItem()
                .title("Import Files")
                .icon(FaFileImport)
                .schemaType("importFile")
                .child(S.documentTypeList("importFile").title("Import Files")),
        ]);