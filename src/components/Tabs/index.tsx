import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
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
    children?: React.ReactNode[] | React.ReactNode;
    notifications?: NotificationMessageInDocumentsType[];
    needMinHeight?: boolean;
    withHorizontalDivider?: boolean;
}
const Tabs: React.FC<TabsType> = ({id, curTab = 0, classNames='', tabTitles, children, needMinHeight=true, notifications, withHorizontalDivider=false}) => {
    const [activeTab, setActiveTab] = useState<number>(curTab);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const tablistRef = useRef<HTMLUListElement>(null);
    const [isTablistCentered, setIsTablistCentered] = useState(false);

    useEffect(() => {
        function handleResize() {
            if (wrapperRef?.current && tablistRef?.current) {
                setIsTablistCentered(
                    wrapperRef.current?.getBoundingClientRect().width >= tablistRef.current.scrollWidth
                );
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return <div className={`tabs-block ${classNames ? classNames : ''}`} id={id}>
        <div className='tabs-block__wrapper'>
            <div className={`tabs-block__tablist-wrapper${withHorizontalDivider ? ' with-h-divider' : ''}`}>
                <div className={`tabs-block__tablist-container`} ref={wrapperRef}>
                    <ul className={`tabs-block__tablist${withHorizontalDivider ? ' with-h-divider' : ''} has-scroll ${isTablistCentered ? 'is-centered' : '' }` } role='tablist' ref={tablistRef}>
                        {tabTitles.map((tab, index) => <li className={`tabs-block__tab ${index===activeTab ? 'active-tab' : ''}`} key={`tab-${index}`}>
                            <a key={`tab-link-${index}`}
                               className={`tabs-block__tab-link ${index === activeTab ? 'active' : ''} ${tab.hasError ? 'has-error' : ''} ${tab.title.replaceAll(' ','-').toLowerCase()+'-tab'}`}
                               href='#' role='tab'
                               aria-controls={`panel-id-${index}`}
                               aria-selected={activeTab===index}
                               id={`tab-id-${index}`}
                               onClick={(e: React.MouseEvent<HTMLAnchorElement>)=>{e.preventDefault(); setActiveTab(index)}}
                            >{tab.title}</a>
                        </li> )}
                    </ul>
                </div>
            </div>
            <div className={`tabs-block__content ${needMinHeight ? 'min-height' : ''}`}>
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