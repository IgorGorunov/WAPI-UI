import React from "react";
import Layout from "@/components/Layout/Layout";
import styles from "./styles.module.scss";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";

const GetStartedPage: React.FC = () => {


    const router = useRouter();

    const handleSignUp = async() => {
        await router.push(Routes.SignUp);
    }


    return (
        <Layout hasFooter isWide >
            {/*<SeoHead title='Get started' description='Our get started page' />*/}
            <div className={`page-component ${styles['get-started-page'] || 'get-started-page'} get-started-page`}>
                <div className={`${styles['get-started-page__container'] || 'get-started-page__container'} get-started-page__container`}>
                    <h1  className={`${styles['get-started-page__main-title'] || 'get-started-page__main-title'} get-started-page__main-title`}>
                        <span>Welcome to the WAPI system,</span><br/>
                        <span>where business owners extend their reach</span><br/>
                        <span>into new markets with their products</span>
                    </h1>

                    <div className={`card ${styles['get-started-page__main-block-wrapper'] || 'get-started-page__main-block-wrapper'} get-started-page__main-block-wrapper`}>
                        <h2 className={`${styles['get-started-page__sub-title'] || 'get-started-page__sub-title'} get-started-page__sub-title`}>Why you should <span className={`${styles['text-bold'] || 'text-bold'} text-bold`}>register</span>? Here's how it <span className={`${styles['text-bold'] || 'text-bold'} text-bold`}>benefits</span> you:
                        </h2>
                        <div className={`${styles['get-started-page__main-block'] || 'get-started-page__main-block'} get-started-page__main-block`}>
                            <div className={`${styles['get-started-page__text-block'] || 'get-started-page__text-block'} get-started-page__text-block`}>
                                <div className={`${styles['get-started-page__text-block-title'] || 'get-started-page__text-block-title'} get-started-page__text-block-title`}>
                                    <div className={`${styles['get-started-page__text-block--icon'] || 'get-started-page__text-block--icon'} get-started-page__text-block--icon`}>
                                        <Icon name='shopping-outline'/>
                                    </div>
                                    <h3>Efficient Order Management</h3>
                                </div>
                                <div className={`${styles['get-started-page__text-block--text'] || 'get-started-page__text-block--text'} get-started-page__text-block--text`}>
                                    <p>Seamlessly place and oversee orders in real-time. Stay updated on order progress
                                        and status, anytime, anywhere.</p>
                                </div>
                            </div>
                            <div className={`${styles['get-started-page__text-block'] || 'get-started-page__text-block'} get-started-page__text-block`}>
                                <div className={`${styles['get-started-page__text-block-title'] || 'get-started-page__text-block-title'} get-started-page__text-block-title`}>
                                    <div className={`${styles['get-started-page__text-block--icon'] || 'get-started-page__text-block--icon'} get-started-page__text-block--icon`}>
                                        <Icon name='fin-transparency'/>
                                    </div>
                                    <h3>Financial Transparency</h3>
                                </div>
                                <div className={`${styles['get-started-page__text-block--text'] || 'get-started-page__text-block--text'} get-started-page__text-block--text`}>
                                    <p>Gain instant access to financial conditions and the outcomes of completed
                                        transactions in real-time, empowering informed decision-making.</p>
                                </div>
                            </div>
                            <div className={`${styles['get-started-page__text-block'] || 'get-started-page__text-block'} get-started-page__text-block`}>
                                <div className={`${styles['get-started-page__text-block-title'] || 'get-started-page__text-block-title'} get-started-page__text-block-title`}>
                                    <div className={`${styles['get-started-page__text-block--icon'] || 'get-started-page__text-block--icon'} get-started-page__text-block--icon`}>
                                        <Icon name='clock'/>
                                    </div>
                                    <h3>24/7 Accessibility</h3>
                                </div>
                                <div className={`${styles['get-started-page__text-block--text'] || 'get-started-page__text-block--text'} get-started-page__text-block--text`}>
                                    <p>Access the system round-the-clock, saving valuable time by creating tickets at
                                        your convenience. Enjoy the perks of managing your account without the need for
                                        phone calls.</p>
                                </div>
                            </div>
                            <div className={`${styles['get-started-page__text-block'] || 'get-started-page__text-block'} get-started-page__text-block`}>
                                <div className={`${styles['get-started-page__text-block-title'] || 'get-started-page__text-block-title'} get-started-page__text-block-title`}>
                                    <div className={`${styles['get-started-page__text-block--icon'] || 'get-started-page__text-block--icon'} get-started-page__text-block--icon`}>
                                        <Icon name='analytics'/>
                                    </div>
                                    <h3>Insightful Analytics</h3>
                                </div>
                                <div className={`${styles['get-started-page__text-block--text'] || 'get-started-page__text-block--text'} get-started-page__text-block--text`}>
                                    {/*<h3>Insightful Analytics</h3>*/}
                                    <p>Access vital reports tailored to your needs. Customize criteria and filters
                                        to
                                        delve into the analytics that matter most to you.</p>

                                </div>
                            </div>
                            <div className={`${styles['get-started-page__text-block'] || 'get-started-page__text-block'} get-started-page__text-block`}>
                                <div className={`${styles['get-started-page__text-block-title'] || 'get-started-page__text-block-title'} get-started-page__text-block-title`}>
                                    <div className={`${styles['get-started-page__text-block--icon'] || 'get-started-page__text-block--icon'} get-started-page__text-block--icon`}>
                                        <Icon name='gala-settings'/>
                                    </div>
                                    <h3>Rapid Product Discovery</h3>
                                </div>
                                <div className={`${styles['get-started-page__text-block--text'] || 'get-started-page__text-block--text'} get-started-page__text-block--text`}>
                                    <p>Effortlessly locate products through intuitive search tools, filters, and
                                        comprehensive product views.</p>
                                </div>
                            </div>
                            <div className={`${styles['get-started-page__text-block'] || 'get-started-page__text-block'} get-started-page__text-block ${styles['with-btn'] || 'with-btn'} with-btn`}>
                                <Button classNames={`${styles['get-started-page__text-block--btn'] || 'get-started-page__text-block--btn'} get-started-page__text-block--btn`} onClick={handleSignUp}>Get started</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default GetStartedPage;