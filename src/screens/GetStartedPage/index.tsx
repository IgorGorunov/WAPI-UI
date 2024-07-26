import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";
import {useTranslations} from "next-intl";

const GetStartedPage: React.FC = () => {
    const t = useTranslations('GetStartedPage');

    const router = useRouter();

    console.log('locale: ', router.locale)

    const handleSignUp = async() => {
        await router.push(Routes.SignUp);
    }


    return (
        <Layout hasFooter isWide >
            <div className="page-component get-started-page">
                <div className="get-started-page__container">
                    <h1 className="get-started-page__main-title">
                        {/*<span>Welcome to the WAPI system,</span><br/>*/}
                        {/*<span>where business owners extend their reach</span><br/>*/}
                        {/*<span>into new markets with their products</span>*/}
                        <span>{t('title1')}</span><br/>
                        <span>{t('title2')}</span><br/>
                        <span>{t('title3')}</span>
                    </h1>

                    <div className="card get-started-page__main-block-wrapper">
                        {/*<h2 className="get-started-page__sub-title">*/}
                        {/*    Why you should*/}
                        {/*    <span className='text-bold'>register</span>*/}
                        {/*    ? Here's how it*/}
                        {/*    <span className='text-bold'>benefits</span>*/}
                        {/*    you:*/}
                        {/*</h2>*/}
                        <h2 className="get-started-page__sub-title">
                            {t('subtitle1')}
                            <span className='text-bold'>{t('subtitle2')}</span>
                            {t('subtitle3')}
                            <span className='text-bold'>{t('subtitle4')}</span>
                            {t('subtitle5')}
                        </h2>
                        <div className="get-started-page__main-block">
                            <div className="get-started-page__text-block">
                                <div className="get-started-page__text-block-title">
                                    <div className="get-started-page__text-block--icon">
                                        <Icon name='shopping-outline'/>
                                    </div>
                                    <h3>{t('cards.card1.title')}</h3>
                                </div>
                                <div className="get-started-page__text-block--text">
                                    <p>{t('cards.card1.text')}</p>
                                </div>
                            </div>
                            <div className="get-started-page__text-block">
                                <div className="get-started-page__text-block-title">
                                    <div className="get-started-page__text-block--icon">
                                        <Icon name='fin-transparency'/>
                                    </div>
                                    <h3>{t('cards.card2.title')}</h3>
                                </div>
                                <div className="get-started-page__text-block--text">
                                    <p>{t('cards.card2.text')}</p>
                                </div>
                            </div>
                            <div className="get-started-page__text-block">
                                <div className="get-started-page__text-block-title">
                                    <div className="get-started-page__text-block--icon">
                                        <Icon name='clock'/>
                                    </div>
                                    <h3>{t('cards.card3.title')}</h3>
                                </div>
                                <div className="get-started-page__text-block--text">
                                    <p>{t('cards.card3.text')}</p>
                                </div>
                            </div>
                            <div className="get-started-page__text-block">
                                <div className="get-started-page__text-block-title">
                                    <div className="get-started-page__text-block--icon">
                                        <Icon name='analytics'/>
                                    </div>
                                    <h3>{t('cards.card4.title')}</h3>
                                </div>
                                <div className="get-started-page__text-block--text">
                                    {/*<h3>Insightful Analytics</h3>*/}
                                    <p>{t('cards.card4.text')}</p>

                                </div>
                            </div>
                            <div className="get-started-page__text-block">
                                <div className="get-started-page__text-block-title">
                                    <div className="get-started-page__text-block--icon">
                                        <Icon name='gala-settings'/>
                                    </div>
                                    <h3>{t('cards.card5.title')}</h3>
                                </div>
                                <div className="get-started-page__text-block--text">
                                    <p>{t('cards.card5.text')}</p>
                                </div>
                            </div>
                            <div className="get-started-page__text-block with-btn">
                                <Button classNames='get-started-page__text-block--btn' onClick={handleSignUp}>{t('getStartedBtn')}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default GetStartedPage;