import React from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import leadTutorialInfo from "@/screens/LeadPage/components/ApprovedLeadInfo/leadTutorialUrlsAndTexts";
import LeadTutorialStep from "@/screens/LeadPage/components/LeadTutorialStep";

const ApiInfo:React.FC = () => {

    const handleDownload = async () => {
        const res = await fetch(`/WAPI capabilities for order processing.pdf`);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = '123.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    const handlePreview = async() => {
        if (window !== undefined) {
            window.open('/WAPI capabilities for order processing.pdf', '_blank');
        }
    }


    return (
        <>
            <LeadTutorialStep stepData={leadTutorialInfo.step7} />
            <div className='api-documentation__container'>
                {/*<a href='https://github.com/wapicom/API/wiki/Documentation-for-integration-with-the-WAPI-system-via-the-API'*/}
                {/*   target='_blank' className='api-documentation__link'><Icon name='api-documentation'/>Explore our API*/}
                {/*    documentation here*/}
                {/*</a>*/}

                <div className='api-documentation__file-container'>
                    <button className='api-documentation__action-btn' onClick={handleDownload}><Icon name='download-file'/>
                    </button>
                    <button className='api-documentation__action-btn' onClick={handlePreview}><Icon name='preview'/></button>
                    <p className='api-documentation__name'>WAPI capabilities for order processing</p>
                </div>


            </div>
        </>
    );
};

export default ApiInfo;