import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import useAuth from "@/context/authContext";
import Header from "@/components/Header";
import {UserStatusType} from "@/types/leads";
import Link from "next/link";

const PrivacyPolicyPage = () => {
    const { userStatus} = useAuth();

    return (
        <Layout hasFooter>
            <div className="privacy-policy-page">
                <Header pageTitle='Privacy policy' toRight noMenu={userStatus !== UserStatusType.user} needNotifications={userStatus === UserStatusType.user} />

                <div className="privacy-policy-page__text-wrapper">
                    <ol>
                        {/*1*/}
                        <li> <span className='heading'>General provisions</span>
                            <ol>
                                <li className='list-item-1'>
                                    The purpose of this “Privacy Policy” (hereinafter - Privacy Policy) is to
                                    provide a Data Subject with information on purpose, legal basis, scope,
                                    terms of processing, protection measures performed by WAPI OÜ, as well as
                                    on the Data Subject's rights in relation to Personal Data processing.
                                    <br/>
                                    Additional information on processing of Personal Data may be included in
                                    agreements, confidentiality notices and other documents, as well as on the
                                    WAPI OÜ websites.
                                </li>
                                <li>This Privacy Policy applies to WAPI OÜ.</li>
                                <li>WAPI OÜ takes care of the privacy of Data Subjects and protection of
                                    Personal Data, observing the Data Subjects' right to the lawfulness of
                                    Personal Data Processing in accordance with the General Data Protection
                                    Regulation and applicable national and other regulatory enactments in the
                                    field of privacy and Personal Data Processing.
                                </li>
                                <li>WAPI OÜ has implemented appropriate technical and organizational
                                    measures to protect Personal Data from unauthorized access, unlawful
                                    disclosure, accidental loss, alteration, destruction or any other unlawful
                                    processing.
                                </li>
                                <li>Personal Data is obtained directly from the Data Subject and from
                                    services used by Data Subject (e.g. in the Electronic Commerce System), as
                                    well as from external sources (e.g. public registers or databases) or other
                                    persons (e.g. legal entity represented by the Data Subject, or whose
                                    employee, official, beneficial owner he/she is). WAPI OÜ may record
                                    telephone conversations, video and / or audio, save e-mail communication
                                    or otherwise document the Data Subject's interaction and communication
                                    with WAPI OÜ.
                                </li>
                            </ol>
                        </li>
                        {/*2*/}
                        <li><span className='heading'>Terms and abbreviations used in the Privacy Policy</span>
                            <ol>
                                <li>Processing - is any action or set of operations performed with or without
                                    automated means on Personal Data or on sets of Personal Data, such as
                                    collection, registration, organization, structuring, storage, adaptation or
                                    modification, recovery, viewing, use, disclosure by dispatching, distributing
                                    or otherwise making available, coordination, combination, restriction,
                                    erasure or destruction.
                                </li>
                                <li>Data Processor - is a natural or legal person, public authority, agency or
                                    another body that processes Personal Data on behalf of the Data Controller.
                                </li>
                                <li>Data Controller - WAPI OÜ that processes Personal Data of the Data
                                    Subject in accordance with the specified purposes and means of Personal
                                    Data Processing.
                                </li>
                                <li>Data Subject - WAPI OÜ potential, current, former client - natural
                                    person, employment candidate, visitor, websites (incl. Electronic Commerce
                                    System) visitor and user, participant of events organized by WAPI OÜ,
                                    employee of legal entities (for example, WAPI OÜ customers, business
                                    partners, tenants, etc.), official, contact person, authorized person,
                                    beneficial owner and any other identified or identifiable natural person,
                                    whose Personal Data is Processed by WAPI OÜ.
                                </li>
                                <li>Electronic Commerce System - WAPI OÜ Electronic commerce system
                                    used by respective WAPI (<Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link> or <Link className='is-link' href='https://ui.wapi.com' target='_blank'>ui.wapi.com</Link>).
                                </li>
                                <li>WAPI OÜ - fulfillment, marketplace and courier aggregator “WAPI OÜ”,
                                    reg. No.14699305, legal address: Harju maakond, Tallinn, Mustamäe
                                    linnaosa, Kadaka tee 7, 12915
                                </li>
                                <li>WAPI OÜ - it is company doing business in the territories of the
                                    European Union and the European Economic Area.
                                </li>
                                <li>Personal Data - any information relating to an identified or identifiable
                                    natural person (Data Subject).
                                </li>
                                <li>General Data Protection Regulation - Regulation (EU) 2016/679 of the
                                    European Parliament and of the Council on the protection of individuals with
                                    regard to the Processing of Personal Data and on the free movement of such
                                    data and repealing Directive 95/46 / EC.
                                </li>
                            </ol>
                        </li>
                        {/*3*/}
                        <li><span className='heading'>Information about Data Controller</span>
                            <ol>
                                <li>WAPI OÜ may be a Data Controller, Data Processor or Joint Controller
                                    when processing Personal Data of the Data Subject.
                                </li>
                                <li>Data Controller is such WAPI OÜ that has at its disposal obtained
                                    Personal Data of the Data Subject, for example, on the basis of a contractual
                                    relationship or before establishment of a contractual relationship, by
                                    submitting an application to the Data Subject or visiting WAPI OÜ premises
                                    or otherwise.
                                </li>
                                <li>The contact information of WAPI OÜ, as well as website address of the
                                    company, is available at: <Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link>
                                </li>
                            </ol>
                        </li>
                        {/*4*/}
                        <li><span className='heading'>Purposes of Personal Data Processing</span>
                            <ol>
                                <li><span className='sub-heading' >WAPI OÜ processes Personal Data mainly for the following purposes:</span>
                                    <ol>
                                        <li>compliance with legal requirements;</li>
                                        <li>conclusion and execution of contracts;</li>
                                        <li>for registration of a client in the Electronic Commerce System, for
                                            ensuring operation of the Electronic Commerce System and for improvement
                                            of operation;
                                        </li>
                                        <li>for placing orders, delivery of goods, fulfillment of product warranty
                                            obligations;
                                        </li>
                                        <li>for preparation of invoices, settlements;</li>
                                        <li>for identification of client / Data Subject;</li>
                                        <li>to ensure communication;</li>
                                        <li>for WAPI OÜ activities, incl. to ensure administrative, accounting and
                                            archival functions;
                                        </li>
                                        <li>to ensure the course of WAPI OÜ personnel selection process and to
                                            ensure legal interests of WAPI OÜ insofar as they are related to the
                                            personnel selection;
                                        </li>
                                        <li>for implementation of rights of WAPI OÜ;</li>
                                        <li>for WAPI OÜ marketing activities (e.g. submission of information and
                                            offers, organization of events for business partners / employees and their
                                            family members and their coverage in the media and social networks,
                                            promotion of recognition of WAPI OÜ image);
                                        </li>
                                        <li>for video surveillance in the respective WAPI OÜ's premises,
                                            warehouses and territories;
                                        </li>
                                        <li>for prevention and detection of criminal offenses;</li>
                                        <li>for obtaining and preservation of evidence in civil disputes;</li>
                                        <li>for reviewing applications / complaints and other documents;</li>
                                        <li>for other purposes in legally justified cases.</li>
                                    </ol>
                                </li>
                                <li>In any of cases referred to in Clause 4.1 of the Privacy Policy, WAPI OÜ
                                    Processes Personal Data to the extent permitted by the specific purpose of
                                    Personal Data Processing and in accordance with the procedures required
                                    and permitted by applicable laws and regulations.
                                </li>
                            </ol>
                        </li>
                        {/*5*/}
                        <li><span className='heading'>Legal basis for Personal Data processing</span>
                            <ol>
                                <li><span className='sub-heading' >WAPI OÜ processes Personal Data on the basis of the following legal
                                    grounds:</span>
                                    <ol>
                                        <li>For conclusion and execution of an agreement - Personal Data
                                            Processing is performed to ensure conclusion of an agreement, provision of
                                            services / sale of goods, settlement process or resolution of issues arising
                                            from the concluded agreement, as well as for taking measures before
                                            conclusion of an agreement;
                                        </li>
                                        <li>In order to fulfill legal obligation - Personal Data Processing is
                                            necessary for WAPI OÜ to fulfill obligation specified in regulatory
                                            enactments, for example, in relation to administrative, accounting, archival
                                            requirements, anti-money laundering and terrorist financing prevention
                                            regulations and compliance with international sanctions, as also in order to
                                            fulfill the requests of law enforcement, supervisory and other institutions
                                            in
                                            the amount and in accordance with the procedures provided for in regulatory
                                            enactments;
                                        </li>
                                        <li>In order to implement or defend legitimate interests - on this basis
                                            Personal Data is processed, for example, for prevention and detection of
                                            criminal offenses related to the protection of property, as well as for
                                            obtaining and preserving evidence in civil disputes (video surveillance),
                                            debt
                                            collection, prevention of loss, for protection of WAPI OÜ rights and
                                            interests
                                            of WAPI OÜ clients, business partners, promotion of WAPI OÜ image
                                            recognition. Based on the legitimate interests of WAPI OÜ, Personal Data is
                                            also processed within the WAPI OÜ personnel selection process. In such
                                            cases, it is assessed that the Privacy of a Data Subject will not be harmed
                                            within the Processing.
                                        </li>
                                        <li>Consent - in some cases WAPI OÜ requires consent to the Processing
                                            of Personal Data. In such cases, Data Subject will be informed separately
                                            about specific purpose of the Processing. Data Subject may withdraw the
                                            consent at any time.
                                        </li>
                                        <li>Public interests - in certain cases Processing of Personal Data of Data
                                            Subjects may be performed on the basis of general public interest. In most
                                            cases, these may be exceptional cases when Processing of Personal Data
                                            needs to be carried out in connection with unforeseen threats to the public
                                            or a specific Data Subject, for example, in connection with the spread of
                                            COVID-19.
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        </li>
                        {/*6*/}
                        <li><span className='heading'>Categories of personal data and their types</span>
                            <ol>
                                <li><span className='sub-heading' >The amount and categories of Personal Data to be processed depend on
                                    the purpose of the Processing, which may differ in different situations. WAPI
                                    OÜ mainly processes the following categories and types of Personal Data:</span>
                                    <ol>
                                        <li>Identification data, such as personal identification code, date of birth,
                                            data of identity documents, incl. photo;
                                        </li>
                                        <li>Contact information, such as address, phone number, email address;
                                        </li>
                                        <li>Data on the use of Electronic Commerce System, for example, data
                                            on accesses and usernames and passwords assigned in the Electronic
                                            Commerce System, purchased goods, activities performed in the
                                            environment of the Electronic Commerce System, usage habits;
                                        </li>
                                        <li>Financial data, for example, information on execution of customer
                                            payments in connection with the goods sold by WAPI OÜ;
                                        </li>
                                        <li>Account details, such as bank account number;</li>
                                        <li>Reliability and research data, such as data on counterparty payment
                                            discipline, data enabling WAPI OÜ to conduct customer research activities
                                            related to prevention of money laundering and terrorist financing and to
                                            verify compliance with international sanctions, including the purpose of
                                            cooperation and whether a business partner, its representative, real
                                            beneficiary is a politically significant person;
                                        </li>
                                        <li>Data obtained and / or created in the course of performing duties
                                            provided for in regulatory enactments, for example, data that WAPI OÜ is
                                            obliged to provide to such institutions as tax authorities, courts, law
                                            enforcement authorities;
                                        </li>
                                        <li>Communication and device data, such as data contained in messages,
                                            e-mails, videos, photographs and / or audio recordings, as well as other
                                            types of communication and interaction data collected when the Data
                                            Subject visits WAPI OÜ premises (incl. using a pass issued by WAPI OÜ) and
                                            organized events or contacted a Data Subject, and data related to the Data
                                            Subject's WAPI OÜ website (incl. visits to Electronic Commerce Systems);
                                        </li>
                                        <li>Professional data, such as data on education or professional career;</li>
                                        <li>Special category Personal Data, such as data on suitability of a job
                                            vacancy candidate for the position to be held.
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        </li>
                        {/*7*/}
                        <li><span className='heading'>Personal Data Protection Measures</span>
                            <ol>
                                <li>For the protection of Personal Data, WAPI OÜ uses various technical and
                                    organizational security measures to protect Personal Data from unauthorized
                                    disclosure, access, loss, erasure, destruction (e.g. data encryption, anti-
                                    burglary equipment, firewalls, security passwords, etc.).
                                </li>
                                <li>Personal Data is available to a limited number of employees of WAPI OÜ
                                    and involved Data Processors, who need it for performance of the respective
                                    official functions / tasks, and who have binding confidentiality requirements.
                                </li>
                            </ol>
                        </li>
                        {/*8*/}
                        <li><span className='heading'>Transfer / Disclosure of Personal Data</span>
                            <ol>
                                <li>WAPI OÜ may transfer Personal Data to persons to whom WAPI OÜ has
                                    the right to disclose them (for example, Data Processors, legal service
                                    providers, etc.) or has an obligation in accordance with regulatory
                                    enactments or concluded agreements, or if the Data Subject's consent has
                                    been obtained.
                                </li>
                                <li><span className='sub-heading' >WAPI OÜ may transfer Personal Data mainly to the following recipients:</span>
                                    <ol>
                                        <li>to another WAPI OÜ, if relevant processes related to the Processing of
                                            Personal Data within WAPI OÜ are provided by the relevant company or in
                                            other cases when it is permitted by regulatory enactments;
                                        </li>
                                        <li>institutions and officials, such as supervisory authorities, tax
                                            authorities, law enforcement authorities, sworn bailiffs, sworn notaries,
                                            courts, out-of-court dispute resolution institutions;
                                        </li>
                                        <li>credit and financial institutions, insurance service providers, third
                                            parties involved in the execution of transactions, settlements and
                                            reporting;
                                        </li>
                                        <li>financial and legal consultants, auditors;</li>
                                        <li>providers of information systems and databases;</li>
                                        <li>debt collection service providers, assignees, insolvency
                                            administrators;
                                        </li>
                                        <li>other persons and suppliers related to the provision of services to
                                            WAPI OÜ, incl. video surveillance, IT, telecommunications, archiving, postal
                                            service providers, etc.
                                        </li>
                                    </ol>
                                </li>
                                <li>WAPI OÜ does not regularly or systematically transfer Personal Data to
                                    third countries (countries outside the European Union and the European
                                    Economic Area), however, Personal Data may be processed by Data
                                    Processors located in third countries (for example, technical solution
                                    developers or service providers). In this case, when transferring Personal
                                    Data, WAPI OÜ ensures the procedures provided for in regulatory
                                    enactments to ensure a level of Personal Data Processing and protection
                                    equivalent to the General Data Protection Regulation.
                                </li>
                            </ol>
                        </li>
                        {/*9*/}
                        <li><span className='heading'>Duration of storage of Personal Data</span>
                            <ol>
                                <li>WAPI OÜ does not store Personal Data for longer than it is necessary for
                                    the respective purpose of Personal Data Processing, or longer than specified
                                    in the binding regulatory enactments.
                                </li>
                                <li>The period of storage of Personal Data depends on the purpose for
                                    which Personal Data has been obtained and whether the period of storage is
                                    provided for in regulatory enactments.
                                </li>
                                <li>WAPI OÜ shall determine the term of Personal Data Processing taking
                                    into account, inter alia, the end date of the business relationship, withdrawal
                                    of the Data Subject's consent to Personal Data Processing and the statutory
                                    period during which WAPI OÜ or the Data Subject may exercise its legitimate
                                    interests (e.g. submit objections and complaints or bring an action).
                                </li>
                            </ol>
                        </li>
                        {/*10*/}
                        <li><span className='heading'>Profiling and automated decision making</span>
                            <ol>
                                <li>WAPI OÜ does not perform profiling and automated decision-making in
                                    relation to the Data Subject.
                                </li>
                            </ol>
                        </li>
                        {/*11*/}
                        <li><span className='heading'>Cookies</span>
                            <ol>
                                <li>WAPI OÜ use cookies on their websites. The cookies used and
                                    information about them are available in the WAPI OÜ Cookie Policy, which is
                                    available on the website of the WAPI OÜ.
                                </li>
                            </ol>
                        </li>
                        {/*12*/}
                        <li><span className='heading'>Rights of the Data Subject</span>
                            <ol>
                                <li><span className='sub-heading' >In accordance with the General Data Protection Regulation, the Data
                                    Subject has the following rights with regard to the processing of his / her
                                    Personal Data:</span>
                                    <ol>
                                        <li>To receive confirmation whether the respective WAPI OÜ processes
                                            Personal Data of the Data Subject and, if it processes, also to access them.
                                        </li>
                                    </ol>
                                </li>
                                <li><span className='sub-heading' >To request correction of the Data Subject's Personal Data if they are
                                    inappropriate, incomplete or incorrect (Data Subject has no right to request
                                    correction or supplementation of video recordings, as this would be
                                    considered as falsification or distortion of information):</span>
                                    <ol>
                                        <li>to request deletion of Personal Data of the Data Subject;</li>
                                        <li>to restrict Processing of Personal Data of the Data Subject;</li>
                                        <li>to restrict Processing of Personal Data of the Data Subject;
                                            12.2.3. To object to the Processing of Personal Data of the Data Subject, if
                                            Processing takes place on the basis of legitimate interests of WAPI OÜ;
                                        </li>
                                        <li>to receive Personal Data submitted by a Data Subject to the relevant
                                            WAPI OÜ and processed on the basis of consent or performance of the
                                            contract in a structured form in one of the most frequently used electronic
                                            formats and, if possible, transfer such Personal Data to another service
                                            provider (rights to data portability);
                                        </li>
                                        <li>to revoke consent of the Data Subject to Processing of Personal
                                            Data.
                                        </li>
                                    </ol>
                                </li>
                                <li>The rights of the Data Subject referred to in Clause 13.1 of the Privacy
                                    Policy shall be exercised insofar as the Processing of Personal Data does n
                                </li>
                                <li>In order to prevent unjustified disclosure of a Data Subject's Personal
                                    Data to third parties, WAPI OÜ exercises rights of a Data Subject on the
                                    basis of a written application, having previously identified the Data Subject.
                                </li>
                                <li><span className='sub-heading' >Application can be submitted in one of the following ways (contact information of
                                    the respective WAPI OÜ is available on its website):</span>
                                    <ol>
                                        <li>
                                            by signing with a qualified secure electronic signature and sending it
                                            to the e-mail address of the respective WAPI OÜ;
                                        </li>
                                        <li>upon personal arrival at the office of the respective WAPI OÜ during
                                            its working hours and after verification of identity of the Data Subject
                                            performed by an employee of the WAPI OÜ, to submit the relevant
                                            application;
                                        </li>
                                        <li>by sending a written application to the legal address of the relevant
                                            WAPI OÜ, indicating in the application postal address to which a reply must
                                            be provided. The answer to such application will be provided only by
                                            registered mail, to the postal address indicated in application.
                                        </li>
                                    </ol>
                                </li>
                                <li>Response to the Data Subject's request will be prepared no later than
                                    within one month after receipt of application; if necessary, for objective
                                    reasons, this period may be extended by further two months.
                                </li>
                                <li>In certain cases provided for in regulatory enactments, WAPI OÜ may
                                    not have the right to provide information to the Data Subject about
                                    processing of Personal Data.</li>
                                <li>WAPI OÜ is entitled to refuse to comply with the requirements
                                    specified in the Data Subject's application if the Data Subject unreasonably
                                    refuses to provide his / her identifying information.</li>
                                <li><span className='sub-heading' >WAPI OÜ reserves the right not to issue Personal Data, incl. Personal
                                    Data obtained during video surveillance in cases where such issuance:</span>
                                    <ol>
                                        <li>affect other Data Subjects and there would be no technical
                                            possibilities to issue Personal Data without infringing the rights of other Data
                                            Subjects;</li>
                                        <li>due to their size or complexity, they require excessive time, staff or
                                            financial resources.</li>
                                    </ol>
                                </li>
                                <li>Data Subject may submit a complaint regarding Personal Data
                                    Processing performed by the respective WAPI OÜ to the Personal Data
                                    Protection Supervisory Authority of the country where the respective WAPI
                                    OÜ is registered, if the Data Subject considers that the Data Subject's
                                    Personal Data Processing violates the Data Subject's rights and interests in
                                    accordance with Personal Data Protection Acts.</li>
                                <li>Contact information of Personal Data Protection supervisory
                                    authorities is available on their websites: Latvia - www.dvi.gov.lv, Lithuania -
                                    www.ada.lt, Estonia - www.aki.ee, Poland - www.uodo.gov.pl, Czech
                                    Republic - www.uoou.cz, Romania - www.dataprotection.ro, in Slovakia -
                                    www.dataprotection.gov.sk, in Slovenia - www.ip-rs.si, in Sweden -
                                    datainspektionen.se</li>
                            </ol>
                        </li>
                        {/*13*/}
                        <li><span className='heading'>Contact information</span>
                            <ol>
                                <li>In case of doubt or for additional information regarding processing of
                                    Personal Data by WAPI OÜ, please contact WAPI OÜ by sending an e-mail
                                    to: <a className='is-link' href="mailto:info@wapi.com">info@wapi.com</a>
                                </li>
                            </ol>
                        </li>
                        {/*14*/}
                        <li><span className='heading'>Privacy Policy Availability and Amendments</span>
                            <ol>
                                <li><span>WAPI OÜ is entitled to unilaterally make changes and additions to the
                                    Privacy Policy at any time by publishing the current version of the Privacy
                                    Policy on the WAPI OÜ website <Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link> or <Link className='is-link' href='https://ui.wapi.com' target='_blank'>ui.wapi.com</Link>
                                </span></li>
                                <li>Privacy Policy is prepared in English and may be translated into other
                                    languages in accordance with the languages of the countries in which the
                                    WAPI OÜ do business.</li>
                            </ol>
                        </li>
                    </ol>
                    <p className='validity-date'>This document is valid as of 10th of May 2024.</p>
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
