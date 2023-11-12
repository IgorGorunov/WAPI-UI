import React, {useState} from "react";
import "./styles.scss";

type TabsType = {
    id: string;
    classNames?: string;
    tabTitles?: string[];
    children?: React.ReactNode[];
}
const Tabs: React.FC<TabsType> = ({id, classNames='', tabTitles, children}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    return <div className={`tabs-block ${classNames ? classNames : ''}`} id={id}>
        <div className='tabs-block__wrapper'>
            <ul className='tabs-block__tablist' role='tablist'>
                {tabTitles.map((title, index) => <li className={`tabs-block__tab ${index===activeTab ? 'active-tab' : ''}`} key={`tab-${index}`}>
                    <a key={`tab-link-${index}`}
                       className={`tabs-block__tab-link ${index === activeTab ? 'active' : ''}`}
                       href='#' role='tab'
                       aria-controls={`panel-id-${index}`}
                       aria-selected={activeTab===index}
                       id={`tab-id-${index}`}
                       onClick={(e: React.MouseEvent<HTMLAnchorElement>)=>{e.preventDefault(); setActiveTab(index)}}
                    >{title}</a>
                </li> )}
            </ul>
            <div className='tabs-block__content'>
                {React.Children.toArray(children).map((tabCntent, index)=> (
                    <div
                        className={`tab-block__content-panel ${index===activeTab} ? 'active' : ''`}
                        role='tabpanel'
                        hidden={index!==activeTab}
                    >
                        {tabCntent}
                    </div>
                ) )}


            </div>
        </div>
    </div>
}

export default Tabs;