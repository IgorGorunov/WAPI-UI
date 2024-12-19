import tableBlock from "./components/tableComponent";
import documentationPage from "./pages/documentationPage";
import textEditor from "./blocks/textEditor";
import imageComponent from "./components/imageComponent";
import textComponent from "./components/textComponent";
import videoFileBlock from "./blocks/videoFileBlock";
import faqPage from "./pages/faqPage";
import videoComponent from "./components/videoComponent";
import downloadableFile from "./components/downloadableFile";
import importFile from "./components/importFile";
import faqQuestionGroup from "./components/faqQuestionGroup";
import faqItem from "./components/faqItem";

const schemas = [
    //pages
    documentationPage,
    faqPage,
    //components
    faqQuestionGroup,
    faqItem,
    tableBlock,
    textEditor,
    textComponent,
    imageComponent,
    videoFileBlock,
    videoComponent,
    downloadableFile,
    importFile,
];

export default schemas;