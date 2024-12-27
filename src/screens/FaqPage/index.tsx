import React, {useCallback, useEffect, useRef, useState} from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Header from "@/components/Header";
import {FaqPageType} from "@/types/sanity/pagesTypes";
import FaqTableOfContents from "@/screens/FaqPage/components/FaqTableOfContents";
import AnswersBlock from "@/screens/FaqPage/components/AnswersBlock";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";


const FaqPage:React.FC<FaqPageType> = (props) => {
    const {isCookieConsentReceived} = useAuth();

    const {content} = props;

    const router = useRouter();

    const sidebarRef = useRef<HTMLDivElement>(null);
    const layoutRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});
    const [visiblePixels, setVisiblePixels] = useState(0);

    useEffect(() => {
        const adjustSidebarPosition = () => {
            if (!sidebarRef.current || !layoutRef.current || !footerRef.current) return;

            const sidebarRect = sidebarRef.current.getBoundingClientRect();
            const layoutRect = layoutRef.current.getBoundingClientRect();
            const footerRect = footerRef.current.getBoundingClientRect();

            const viewportHeight = window.innerHeight;
            const visibleHeight = Math.max(
                0,
                Math.min(layoutRect.bottom, viewportHeight) - Math.max(layoutRect.top, 0)
            );
            setVisiblePixels(isCookieConsentReceived ? visibleHeight : visibleHeight - 40);

            // If sidebar reaches the top of the viewport, stick it
            if (layoutRect.top < 0 && (footerRect.top + (isCookieConsentReceived ? 0 : -40)) > window.innerHeight) {
                setSidebarStyle({
                    position: "fixed",
                    top: "0px",
                    bottom: "auto",
                });
            }
            // Stick sidebar to the footer when it overlaps
            else if ((footerRect.top + (isCookieConsentReceived ? 0 : -40)) <= sidebarRect.bottom) { //window.innerHeight) {
                if (sidebarRect.top >= 0) {
                    setSidebarStyle({
                        position: "fixed",
                        top: "0px",
                        bottom: "auto",
                    });
                } else {
                    setSidebarStyle({
                        position: "absolute",
                        top: "auto",
                        bottom: "0px",
                    });
                }
            }
            // If the user scrolls back to the top, return it to natural position
            else if (layoutRect.top >= 0 ) {
                setSidebarStyle({
                    position: "relative",
                    top: "auto",
                    bottom: "auto",
                });
            }
        };

        window.addEventListener("scroll", adjustSidebarPosition);
        adjustSidebarPosition(); // Initial adjustment

        return () => {
            window.removeEventListener("scroll", adjustSidebarPosition);
        };
    }, []);

    useEffect(() => {
        if (router.isReady && router.query.question) {
            const anchorId = router.query.question as string;
            const targetElement = document.getElementById(anchorId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [router.isReady, router.query.anchorId]);

    const handleClickToScrollTo = useCallback((anchorId: string) => {
        router.push(
            {
                pathname: router.pathname, // Keep the current path
                query: { ...router.query, question: anchorId }, // Add the anchorId to the query
            },
            undefined,
            { shallow: true } // Prevent a full page reload
        );

        const element = document.getElementById(anchorId);
        console.log('click: ', anchorId, element)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <Layout hasHeader hasFooter >
            <div className="faq-page page-container">
                {/*{isLoading && <Loader />}*/}
                <Header pageTitle='FAQ' toRight  />
                <div className="faq-page__wrapper">
                    {/*{heading ? <h2 className='faq-page__header'>{heading}</h2> : null}*/}
                    <div className="faq-page__container" ref={layoutRef}>
                        <div className={`faq-table-of-contents`} >
                            <div className = {`faq-table-of-contents__wrapper` } ref={sidebarRef} style={{...sidebarStyle, maxHeight: (visiblePixels-10)+'px'}} >
                            <FaqTableOfContents content={content} onClick={handleClickToScrollTo}/></div>
                        </div>
                        <div className={`faq-answers`}>

                            <AnswersBlock content={content} onClick={handleClickToScrollTo}/>
                        </div>
                    </div>
                    <div className='faq-page__bottom' ref={footerRef} ></div>
                </div>
            </div>
            {/*<div className='footer-wrapper' ref={footerRef}>*/}
            {/*    <Footer/>*/}
            {/*</div>*/}
        </Layout>
);
};

export default FaqPage;
