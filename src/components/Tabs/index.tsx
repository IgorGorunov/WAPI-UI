import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";
import NotificationMessageInDocuments, {NotificationMessageInDocumentsType} from "@/components/NotificationMessageInDocuments";

type TabTitle = {
    title: string;
    hasError?: boolean;
}
type TabsType = {
    id: string;
    curTab?: number;
    setCurTab?: (newTab: number)=>void;
    classNames?: string;
    tabTitles?: TabTitle[];
    children?: React.ReactNode[] | React.ReactNode;
    notifications?: NotificationMessageInDocumentsType[];
    extraInfo?: React.ReactNode;
    needMinHeight?: boolean;
    needMinHeightSmall?: boolean;
    withHorizontalDivider?: boolean;
    needContentScroll?: boolean;
}
const Tabs: React.FC<TabsType> = ({id, curTab = 0, setCurTab, classNames='', tabTitles, children, needMinHeight=true, needMinHeightSmall=false, notifications, extraInfo,  withHorizontalDivider=false, needContentScroll= true}) => {

    const tabListRef = useRef<HTMLUListElement | null>(null);
    const tabContentRef = useRef<HTMLDivElement | null>(null);

    const scrollToTabList = () => {
        //tabListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const tabList = tabListRef?.current;

        if (!tabList) return;

        // Get the bounding rectangle of the tabList element relative to the viewport
        const rect = tabList.getBoundingClientRect();

        // Check if tabList is out of view (either above or below the viewport)
        const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;

        // Scroll only if tabList is out of view
        if (isOutOfView) {
            // Calculate the target scroll position to center tabList in the viewport
            const scrollY = window.scrollY + rect.top - (window.innerHeight / 2 - rect.height / 2);

            window.scrollTo({
                top: scrollY,
                behavior: 'smooth'
            });
        }

    };

    const scrollContent = () => {
        tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const [activeTab, setActiveTab] = useState<number>(curTab);

    useEffect(() => {
        if (curTab) {
            setActiveTab(curTab);
        }
    }, [curTab]);

    useEffect(() => {
        scrollToTabList();
        if (needContentScroll) {
            scrollContent();
        }
    }, [activeTab]);

    const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        e.preventDefault(); setActiveTab(index);
        if (setCurTab && curTab && curTab !== index) {
            setCurTab(index);
        }
    }

    return <div className={`tabs-block ${classNames ? classNames : ''}`} id={id}>
        <div className='tabs-block__wrapper'>
            <ul id='tabList' className={`tabs-block__tablist${withHorizontalDivider ? ' with-h-divider' : ''}`} role='tablist' ref={tabListRef}>
                {tabTitles.map((tab, index) => <li className={`tabs-block__tab ${index===activeTab ? 'active-tab' : ''}`} key={`tab-${index}`}>
                    <a key={`tab-link-${index}`}
                       className={`tabs-block__tab-link ${index === activeTab ? 'active' : ''} ${tab.hasError ? 'has-error' : ''} ${tab.title.replaceAll(' ','-').toLowerCase()+'-tab'}`}
                       href='#' role='tab'
                       aria-controls={`panel-id-${index}`}
                       aria-selected={activeTab===index}
                       id={`tab-id-${index}`}
                       onClick={(e: React.MouseEvent<HTMLAnchorElement>)=>{handleTabClick(e, index)}}
                    >{tab.title}</a>
                </li> )}
            </ul>

            <div className={`tabs-block__content ${needMinHeight ? 'min-height' : ''} ${needMinHeightSmall ? 'min-height-small' : ''}`} >
                <div className={`tabs-block__content-wrapper`} ref={tabContentRef}>
                    {extraInfo ? extraInfo : null}
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
                            key={`tabs-block__content-panel_${index}`}
                            className={`tabs-block__content-panel ${index===activeTab ? 'active' : ''}`}
                            role='tabpanel'
                            hidden={index!==activeTab}
                        >
                            {tabCntent}
                        </div>
                    ) )}

                </div>
            </div>
        </div>
    </div>
}

export default Tabs;