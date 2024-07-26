import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import useAuth from "@/context/authContext";
import Header from "@/components/Header";
import {UserStatusType} from "@/types/leads";
import Link from "next/link";
import {useTranslations} from "next-intl";

const PrivacyPolicyPage = () => {
    const t = useTranslations('PrivacyPolicy');

    const { userStatus} = useAuth();

    return (
        <Layout hasFooter>
            <div className="privacy-policy-page">
                <Header pageTitle={t('headerTitle')} toRight noMenu={userStatus !== UserStatusType.user} needNotifications={userStatus === UserStatusType.user} />

                <div className="privacy-policy-page__text-wrapper">
                    <ol>
                        {/*1*/}
                        <li> <span className='heading'>{t('item1')}</span>
                            <ol>
                                <li className='list-item-1'>
                                    {t('item1-1-1')}
                                    <br/>
                                    {t('item1-1-2')}
                                </li>
                                <li>{t('item1-2')}</li>
                                <li>{t('item1-3')}
                                </li>
                                <li>{t('item1-4')}
                                </li>
                                <li>{t('item1-5')}
                                </li>
                            </ol>
                        </li>
                        {/*2*/}
                        <li><span className='heading'>{t('item2')}</span>
                            <ol>
                                <li>{t('item2-1')}</li>
                                <li>{t('item2-1')}</li>
                                <li>{t('item2-3')}</li>
                                <li>{t('item2-4')}
                                </li>
                                <li>{t('item2-5_1')}<Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link>{t('item2-5_2')}<Link className='is-link' href='https://ui.wapi.com' target='_blank'>ui.wapi.com</Link>{t('item2-5_3')}
                                </li>
                                <li>{t('item2-6')}</li>
                                <li>{t('item2-7')}</li>
                                <li>{t('item2-8')}</li>
                                <li>{t('item2-9')}</li>
                            </ol>
                        </li>
                        {/*3*/}
                        <li><span className='heading'>{t('item3')}</span>
                            <ol>
                                <li>{t('item3-1')}</li>
                                <li>{t('item3-2')}</li>
                                <li>{t('item3-3_1')}<Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link>{t('item3-3_2')}
                                </li>
                            </ol>
                        </li>
                        {/*4*/}
                        <li><span className='heading'>{t('item4')}</span>
                            <ol>
                                <li><span className='sub-heading' >{t('item4-1')}</span>
                                    <ol>
                                        <li>{t('item4-1-1')}</li>
                                        <li>{t('item4-1-2')}</li>
                                        <li>{t('item4-1-3')}</li>
                                        <li>{t('item4-1-4')}</li>
                                        <li>{t('item4-1-5')}</li>
                                        <li>{t('item4-1-6')}</li>
                                        <li>{t('item4-1-7')}</li>
                                        <li>{t('item4-1-8')}</li>
                                        <li>{t('item4-1-9')}</li>
                                        <li>{t('item4-1-10')}</li>
                                        <li>{t('item4-1-11')}</li>
                                        <li>{t('item4-1-12')}</li>
                                        <li>{t('item4-1-13')}</li>
                                        <li>{t('item4-1-14')}</li>
                                        <li>{t('item4-1-15')}</li>
                                        <li>{t('item4-1-16')}</li>
                                    </ol>
                                </li>
                                <li>{t('item4-2')}</li>
                            </ol>
                        </li>
                        {/*5*/}
                        <li><span className='heading'>{t('item5')}</span>
                            <ol>
                                <li><span className='sub-heading' >{t('item5-1')}</span>
                                    <ol>
                                        <li>{t('item5-1-1')}</li>
                                        <li>{t('item5-1-2')}</li>
                                        <li>{t('item5-1-3')}</li>
                                        <li>{t('item5-1-4')}</li>
                                        <li>{t('item5-1-5')}</li>
                                    </ol>
                                </li>
                            </ol>
                        </li>
                        {/*6*/}
                        <li><span className='heading'>{t('item6')}</span>
                            <ol>
                                <li><span className='sub-heading'>{t('item6-1')}</span>
                                    <ol>
                                        <li>{t('item6-1-1')}</li>
                                        <li>{t('item6-1-2')}</li>
                                        <li>{t('item6-1-3')}</li>
                                        <li>{t('item6-1-4')}</li>
                                        <li>{t('item6-1-5')}</li>
                                        <li>{t('item6-1-6')}</li>
                                        <li>{t('item6-1-7')}</li>
                                        <li>{t('item6-1-8')}</li>
                                        <li>{t('item6-1-9')}</li>
                                        <li>{t('item6-1-10')}</li>
                                    </ol>
                                </li>
                            </ol>
                        </li>
                        {/*7*/}
                        <li><span className='heading'>{t('item7')}</span>
                            <ol>
                                <li>{t('item7-1')}</li>
                                <li>{t('item7-2')}</li>
                            </ol>
                        </li>
                        {/*8*/}
                        <li><span className='heading'>{t('item8')}</span>
                            <ol>
                                <li>{t('item8-1')}</li>
                                <li><span className='sub-heading'>{t('item8-2')}</span>
                                    <ol>
                                        <li>{t('item8-2-1')}</li>
                                        <li>{t('item8-2-2')}</li>
                                        <li>{t('item8-2-3')}</li>
                                        <li>{t('item8-2-4')}</li>
                                        <li>{t('item8-2-5')}</li>
                                        <li>{t('item8-2-6')}</li>
                                        <li>{t('item8-2-7')}</li>
                                    </ol>
                                </li>
                                <li>{t('item8-3')}</li>
                            </ol>
                        </li>
                        {/*9*/}
                        <li><span className='heading'>{t('item9')}</span>
                            <ol>
                                <li>{t('item9-1')}</li>
                                <li>{t('item9-2')}</li>
                                <li>{t('item9-3')}</li>
                            </ol>
                        </li>
                        {/*10*/}
                        <li><span className='heading'>{t('item10')}</span>
                            <ol>
                                <li>{t('item10-1')}</li>
                            </ol>
                        </li>
                        {/*11*/}
                        <li><span className='heading'>{t('item11')}</span>
                            <ol>
                                <li>{t('item11-1')}</li>
                            </ol>
                        </li>
                        {/*12*/}
                        <li><span className='heading'>{t('item12')}</span>
                            <ol>
                                <li><span className='sub-heading' >{t('item12-1')}</span>
                                    <ol>
                                        <li>{t('item12-1-1')}</li>
                                    </ol>
                                </li>
                                <li><span className='sub-heading' >{t('item12-2')}</span>
                                    <ol>
                                        <li>{t('item12-2-1')}</li>
                                        <li>{t('item12-2-2')}</li>
                                        <li>{t('item12-2-3')}</li>
                                        <li>{t('item12-2-4')}</li>
                                        <li>{t('item12-2-5')}</li>
                                    </ol>
                                </li>
                                <li>{t('item12-3')}</li>
                                <li>{t('item12-4')}</li>
                                <li><span className='sub-heading' >{t('item12-5')}</span>
                                    <ol>
                                        <li>{t('item12-5-1')}</li>
                                        <li>{t('item12-5-2')}</li>
                                        <li>{t('item12-5-3')}</li>
                                    </ol>
                                </li>
                                <li>{t('item12-6')}</li>
                                <li>{t('item12-7')}</li>
                                <li>{t('item12-8')}</li>
                                <li><span className='sub-heading' >{t('item12-9')}</span>
                                    <ol>
                                        <li>{t('item12-9-1')}</li>
                                        <li>{t('item12-9-2')}</li>
                                    </ol>
                                </li>
                                <li>{t('item12-10')}</li>
                                <li>{t('item12-11')}</li>
                            </ol>
                        </li>
                        {/*13*/}
                        <li><span className='heading'>{t('item13')}</span>
                            <ol>
                                <li>{t('item13-1_1')}<a className='is-link' href="mailto:info@wapi.com">info@wapi.com</a>{t('item13-1_2')}
                                </li>
                            </ol>
                        </li>
                        {/*14*/}
                        <li><span className='heading'>{t('item14')}</span>
                            <ol>
                                <li><span>{t('item14-1_1')} <Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link>{t('item14-1_2')}<Link className='is-link' href='https://ui.wapi.com' target='_blank'>ui.wapi.com</Link>{t('item14-1_3')}
                                </span></li>
                                <li>{t('item14-2')}</li>
                            </ol>
                        </li>
                    </ol>
                    <p className='validity-date'>{t('validity')}</p>
                    {/*<p>This Cookie Policy explains how we use cookies and similar tracking technologies when you visit*/}
                    {/*    our website <Link className='is-link' href='/'>https://ui.wapi.com</Link>. By continuing to browse the site, you are agreeing to our use*/}
                    {/*    of cookies as outlined in this policy.</p>*/}
                    {/*<p className='text-bold'>What are cookies? </p>*/}

                    {/*<p>Cookies are small text files that are placed on your computer or mobile device when you visit a*/}
                    {/*    website. They are widely used to make websites work more efficiently and to provide information*/}
                    {/*    to website owners. </p>*/}
                    {/*<p className='text-bold'>How do we use cookies? </p>*/}
                    {/*<p>We use cookies for the following purposes: </p>*/}
                    {/*<ol className='simple-list'>*/}
                    {/*    <li><p><span className='text-bold'>Essential Cookies:</span> These cookies are necessary for the website to function properly. They enable you to navigate the website and use its features.</p></li>*/}
                    {/*    <li><p><span className='text-bold'>Functionality Cookies:</span> These cookies are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name, and remember your preferences (for example, your choice of language or region).</p></li>*/}
                    {/*</ol>*/}
                    {/*<p className='text-bold'>Updates to this Cookie Policy </p>*/}
                    {/*<p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies. </p>*/}
                    {/*<p>By using our website, you consent to the use of cookies as described in this Cookie Policy.</p>*/}
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicyPage;
