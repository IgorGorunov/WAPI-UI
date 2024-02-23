import React, {useState} from "react";
import "./styles.scss";
import NotificationMessageInDocuments, {NotificationMessageInDocumentsType} from "@/components/NotificationMessageInDocuments";

type TabTitle = {
    title: string;
    hasError?: boolean;
}
type TabsType = {
    id: string;
    curTab?: number;
    classNames?: string;
    tabTitles?: TabTitle[];
    children?: React.ReactNode[];
    notifications?: NotificationMessageInDocumentsType[];
}
const Tabs: React.FC<TabsType> = ({id, curTab = 0, classNames='', tabTitles, children, notifications}) => {
    const [activeTab, setActiveTab] = useState<number>(curTab);
    return <div className={`tabs-block ${classNames ? classNames : ''}`} id={id}>
        <div className='tabs-block__wrapper'>
            <ul className='tabs-block__tablist' role='tablist'>
                {tabTitles.map((tab, index) => <li className={`tabs-block__tab ${index===activeTab ? 'active-tab' : ''}`} key={`tab-${index}`}>
                    <a key={`tab-link-${index}`}
                       className={`tabs-block__tab-link ${index === activeTab ? 'active' : ''} ${tab.hasError ? 'has-error' : ''}`}
                       href='#' role='tab'
                       aria-controls={`panel-id-${index}`}
                       aria-selected={activeTab===index}
                       id={`tab-id-${index}`}
                       onClick={(e: React.MouseEvent<HTMLAnchorElement>)=>{e.preventDefault(); setActiveTab(index)}}
                    >{tab.title}</a>
                </li> )}
            </ul>
            <div className='tabs-block__content'>
                {notifications && notifications.length ?
                    <div className='tabs-block__content-notifications'>
                        {notifications.map(notification => (
                            <div key={notification.uuid} className='tabs-block__content-notification'>
                                <NotificationMessageInDocuments {...notification} />
                            </div>
                        ))}
                    </div>
                 : null}

                {React.Children.toArray(children).map((tabCntent, index)=> (
                    <div
                        key={`tab-block__content-panel_${index}`}
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