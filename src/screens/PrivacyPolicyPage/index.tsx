import React from "react";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Header from "@/components/Header";
import Link from "next/link";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";

const PrivacyPolicyPage = () => {
    const {tenant, getTenantData} = useTenant();
    const tenantData = getTenantData(tenant);
    const companyName = tenantData?.name || '';
    const privacyPolicy = tenantData?.privacyPolicy;

    const renderWebsites = () => {
        if (privacyPolicy && privacyPolicy.websites && privacyPolicy.websites.length) {
            return (
                <>
                    {privacyPolicy.websites.map((website, index) => {
                        return (
                            <>
                                {index >0 ? ' or ' : ''}<Link className='is-link' href={website.link} target='_blank'>{website.text}</Link>
                            </>
                        )
                    }) }
                </>
            );
        }
         return null;
    }

    // <Link className='is-link' href='https://wapi.com/' target='_blank'>wapi.com</Link> or <Link className='is-link' href='https://ui.wapi.com' target='_blank'>ui.wapi.com</Link>

    return (
        <Layout hasFooter>
            <SeoHead title='Privacy Policy' description='Our privacy policy page' />
            <div className="privacy-policy-page">
                <Header pageTitle='Privacy policy' toRight  />

                <div className="privacy-policy-page__text-wrapper">
                    <ol>
                        {/*1*/}
                        <li> <span className='heading'>General provisions</span>
                            <ol>
                                <li className='list-item-1'>
                                    The purpose of this “Privacy Policy” (hereinafter - Privacy Policy) is to
                                    provide a Data Subject with information on purpose, legal basis, scope,
                                    terms of processing, protection measures performed by {companyName}, as well as
                                    on the Data Subject's rights in relation to Personal Data processing.
                                    <br/>
                                    Additional information on processing of Personal Data may be included in
                                    agreements, confidentiality notices and other documents, as well as on
                                    the {companyName} websites.
                                </li>
                                <li>This Privacy Policy applies to {companyName}.</li>
                                <li>{companyName} takes care of the privacy of Data Subjects and protection of
                                    Personal Data, observing the Data Subjects' right to the lawfulness of
                                    Personal Data Processing in accordance with the General Data Protection
                                    Regulation and applicable national and other regulatory enactments in the
                                    field of privacy and Personal Data Processing.
                                </li>
                                <li>{companyName} has implemented appropriate technical and organizational
                                    measures to protect Personal Data from unauthorized access, unlawful
                                    disclosure, accidental loss, alteration, destruction or any other unlawful
                                    processing.
                                </li>
                                <li>Personal Data is obtained directly from the Data Subject and from
                                    services used by Data Subject (e.g. in the Electronic Commerce System), as
                                    well as from external sources (e.g. public registers or databases) or other
                                    persons (e.g. legal entity represented by the Data Subject, or whose
                                    employee, official, beneficial owner he/she is). {companyName} may record
                                    telephone conversations, video and / or audio, save e-mail communication
                                    or otherwise document the Data Subject's interaction and communication
                                    with {companyName}.
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
                                <li>Data Controller - {companyName} that processes Personal Data of the Data
                                    Subject in accordance with the specified purposes and means of Personal
                                    Data Processing.
                                </li>
                                <li>Data Subject - {companyName} potential, current, former client - natural
                                    person, employment candidate, visitor, websites (incl. Electronic Commerce
                                    System) visitor and user, participant of events organized by {companyName},
                                    employee of legal entities (for example, {companyName} customers, business
                                    partners, tenants, etc.), official, contact person, authorized person,
                                    beneficial owner and any other identified or identifiable natural person,
                                    whose Personal Data is Processed by {companyName}.
                                </li>
                                <li>Electronic Commerce System - {companyName} Electronic commerce system
                                    used by respective {companyName} ({renderWebsites()}).
                                </li>
                                <li>{companyName} - fulfillment, marketplace and courier aggregator “{companyName}”,
                                    reg. No.{privacyPolicy?.regNumber || ''}, legal address: {privacyPolicy?.legalAddress || ''}
                                </li>
                                <li>{companyName} - it is company doing business in the territories of the
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
                                <li>{companyName} may be a Data Controller, Data Processor or Joint Controller
                                    when processing Personal Data of the Data Subject.
                                </li>
                                <li>Data Controller is such {companyName} that has at its disposal obtained
                                    Personal Data of the Data Subject, for example, on the basis of a contractual
                                    relationship or before establishment of a contractual relationship, by
                                    submitting an application to the Data Subject or visiting {companyName} premises
                                    or otherwise.
                                </li>
                                {privacyPolicy?.contactInfo?.isAvailable ? (
                                    <li>The contact information of {companyName}, as well as website address of the
                                        company, is available at: <Link className='is-link' href={privacyPolicy?.contactInfo?.websiteLink || ''} target='_blank'>{privacyPolicy?.contactInfo?.websiteText || ''}</Link>
                                    </li>
                                ) : null }
                            </ol>
                        </li>
                        {/*4*/}
                        <li><span className='heading'>Purposes of Personal Data Processing</span>
                            <ol>
                                <li><span className='sub-heading' >{companyName} processes Personal Data mainly for the following purposes:</span>
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
                                        <li>for {companyName} activities, incl. to ensure administrative, accounting and
                                            archival functions;
                                        </li>
                                        <li>to ensure the course of {companyName} personnel selection process and to
                                            ensure legal interests of {companyName} insofar as they are related to the
                                            personnel selection;
                                        </li>
                                        <li>for implementation of rights of {companyName};</li>
                                        <li>for {companyName} marketing activities (e.g. submission of information and
                                            offers, organization of events for business partners / employees and their
                                            family members and their coverage in the media and social networks,
                                            promotion of recognition of {companyName} image);
                                        </li>
                                        <li>for video surveillance in the respective {companyName}'s premises,
                                            warehouses and territories;
                                        </li>
                                        <li>for prevention and detection of criminal offenses;</li>
                                        <li>for obtaining and preservation of evidence in civil disputes;</li>
                                        <li>for reviewing applications / complaints and other documents;</li>
                                        <li>for other purposes in legally justified cases;</li>
                                        <li className='list-item--new'>
                                            for ensuring accountability, audit logging and system security, including recording
                                            actions performed by users within their accounts and storing related metadata such
                                            as login identifier (email). These logs are necessary for the provision of services,
                                            contractual reporting to client account holders, and for the detection and prevention
                                            of unauthorized access or misuse.
                                        </li>
                                    </ol>
                                </li>
                                <li>In any of cases referred to in Clause 4.1 of the Privacy Policy, {companyName} Processes
                                    Personal Data to the extent permitted by the specific purpose of
                                    Personal Data Processing and in accordance with the procedures required
                                    and permitted by applicable laws and regulations.
                                </li>
                            </ol>
                        </li>
                        {/*5*/}
                        <li><span className='heading'>Legal basis for Personal Data processing</span>
                            <ol>
                                <li><span className='sub-heading' >{companyName} processes Personal Data on the basis of
                                    the following legal grounds:</span>
                                    <ol>
                                        <li>For conclusion and execution of an agreement - Personal Data
                                            Processing is performed to ensure conclusion of an agreement, provision of
                                            services / sale of goods, settlement process or resolution of issues arising
                                            from the concluded agreement, as well as for taking measures before
                                            conclusion of an agreement;
                                        </li>
                                        <li>In order to fulfill legal obligation - Personal Data Processing is
                                            necessary for {companyName} to fulfill obligation specified in regulatory
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
                                            collection, prevention of loss, for protection of {companyName} rights and
                                            interests
                                            of {companyName} clients, business partners, promotion of {companyName}image
                                            recognition. Based on the legitimate interests of {companyName}, Personal Data is
                                            also processed within the {companyName} personnel selection process. In such
                                            cases, it is assessed that the Privacy of a Data Subject will not be harmed
                                            within the Processing.
                                        </li>
                                        <li>Consent - in some cases {companyName} requires consent to the Processing
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
                                <li><span className='sub-heading' >The amount and categories of Personal Data to be
                                    processed depend on the purpose of the Processing, which may differ in different
                                    situations. {companyName} mainly processes the following categories and types of
                                    Personal Data:</span>
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
                                            payments in connection with the goods sold by {companyName};
                                        </li>
                                        <li>Account details, such as bank account number;</li>
                                        <li>Reliability and research data, such as data on counterparty payment
                                            discipline, data enabling {companyName} to conduct customer research activities
                                            related to prevention of money laundering and terrorist financing and to
                                            verify compliance with international sanctions, including the purpose of
                                            cooperation and whether a business partner, its representative, real
                                            beneficiary is a politically significant person;
                                        </li>
                                        <li>Data obtained and / or created in the course of performing duties
                                            provided for in regulatory enactments, for example, data that {companyName} is
                                            obliged to provide to such institutions as tax authorities, courts, law
                                            enforcement authorities;
                                        </li>
                                        <li>Communication and device data, such as data contained in messages,
                                            e-mails, videos, photographs and / or audio recordings, as well as other
                                            types of communication and interaction data collected when the Data
                                            Subject visits {companyName} premises (incl. using a pass issued by {companyName}) and
                                            organized events or contacted a Data Subject, and data related to the Data
                                            Subject's {companyName} website (incl. visits to Electronic Commerce Systems);
                                        </li>
                                        <li className='list-item--new'>
                                            Log and access data, such as user login identifier (email), account role and actions
                                            performed within the system. This information is recorded automatically for audit, security and
                                            service-provision purposes;
                                        </li>
                                        <li className='list-item--new'>
                                            Tenant / seller identification data, such as the internal system UUIDs of the client’s
                                            tenant or sub-tenant accounts used in the whitelabel functionality. These identifiers
                                            are required to ensure that users can access and manage the correct data sets within
                                            their respective accounts;
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
                                <li>For the protection of Personal Data, {companyName} uses various technical and
                                    organizational security measures to protect Personal Data from unauthorized
                                    disclosure, access, loss, erasure, destruction (e.g. data encryption, anti-
                                    burglary equipment, firewalls, security passwords, etc.).
                                </li>
                                <li>Personal Data is available to a limited number of employees of {companyName} and
                                    involved Data Processors, who need it for performance of the respective
                                    official functions / tasks, and who have binding confidentiality requirements.
                                </li>
                            </ol>
                        </li>
                        {/*8*/}
                        <li><span className='heading'>Transfer / Disclosure of Personal Data</span>
                            <ol>
                                <li>{companyName} may transfer Personal Data to persons to whom {companyName} has
                                    the right to disclose them (for example, Data Processors, legal service
                                    providers, etc.) or has an obligation in accordance with regulatory
                                    enactments or concluded agreements, or if the Data Subject's consent has
                                    been obtained.
                                </li>
                                <li><span className='sub-heading' >{companyName} may transfer Personal Data mainly to the following recipients:</span>
                                    <ol>
                                        <li>to another {companyName}, if relevant processes related to the Processing of
                                            Personal Data within {companyName} are provided by the relevant company or in
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
                                        <li>other persons and suppliers related to the provision of services to {companyName},
                                            incl. video surveillance, IT, telecommunications, archiving, postal
                                            service providers, etc.
                                        </li>
                                    </ol>
                                </li>
                                <li className={'list-item--new'}>
                                    Audit logs and technical data are not shared with third parties except where
                                    required by law or contract with the main client account holder. They are stored
                                    within the European Union / EEA data-hosting infrastructure used by {companyName}.
                                </li>
                                <li>{companyName} does not regularly or systematically transfer Personal Data to
                                    third countries (countries outside the European Union and the European
                                    Economic Area), however, Personal Data may be processed by Data
                                    Processors located in third countries (for example, technical solution
                                    developers or service providers). In this case, when transferring Personal
                                    Data, {companyName} ensures the procedures provided for in regulatory
                                    enactments to ensure a level of Personal Data Processing and protection
                                    equivalent to the General Data Protection Regulation.
                                </li>
                            </ol>
                        </li>
                        {/*9*/}
                        <li><span className='heading'>Duration of storage of Personal Data</span>
                            <ol>
                                <li>{companyName} does not store Personal Data for longer than it is necessary for
                                    the respective purpose of Personal Data Processing, or longer than specified
                                    in the binding regulatory enactments.
                                </li>
                                <li>The period of storage of Personal Data depends on the purpose for
                                    which Personal Data has been obtained and whether the period of storage is
                                    provided for in regulatory enactments.
                                </li>
                                <li>{companyName} shall determine the term of Personal Data Processing taking
                                    into account, inter alia, the end date of the business relationship, withdrawal
                                    of the Data Subject's consent to Personal Data Processing and the statutory
                                    period during which {companyName} or the Data Subject may exercise its legitimate
                                    interests (e.g. submit objections and complaints or bring an action).
                                </li>
                                <li className={'list-item--new'}>
                                    Session cookies such as token, userEmail and
                                    sellers are deleted when the browser session ends. Audit logs containing
                                    user actions are retained for the minimum period necessary to ensure
                                    accountability and contractual reporting, normally no longer than 90–180 days, unless
                                    required longer by law or to resolve incidents.
                                </li>
                            </ol>
                        </li>
                        {/*10*/}
                        <li><span className='heading'>Profiling and automated decision making</span>
                            <ol>
                                <li>{companyName} does not perform profiling and automated decision-making in
                                    relation to the Data Subject.
                                </li>
                            </ol>
                        </li>
                        {/*11*/}
                        <li><span className='heading'>Cookies</span>
                            <ol>
                                {/*<li>{companyName} use cookies on their websites. The cookies used and*/}
                                {/*    information about them are available in the {companyName} Cookie Policy, which is*/}
                                {/*    available on the website of the {companyName}.*/}
                                {/*</li>*/}
                                <li className={'list-item--new'}>
                                    {companyName} uses cookies and similar technologies on its websites and Electronic
                                    Commerce System. Essential cookies are required for secure login, permissions,
                                    and displaying the correct tenant or seller data (e.g., token,
                                    userStatus, userEmail, sellers).
                                    Functional cookies improve the user experience (for example, remembering completed
                                    tutorials or displaying the logged-in account name), and performance cookies
                                    (Microsoft Clarity) help us understand and improve website usability.
                                    Optional cookies are used only with the Data Subject’s consent.
                                    Detailed information about each cookie, its purpose and duration is provided in the
                                    <a className='is-link' href='/cookie-policy' target='_blank'> Cookie Policy</a>.
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
                                        <li>To receive confirmation whether the respective {companyName} processes
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
                                            Processing takes place on the basis of legitimate interests of {companyName};
                                        </li>
                                        <li>to receive Personal Data submitted by a Data Subject to the relevant
                                            {companyName} and processed on the basis of consent or performance of the
                                            contract in a structured form in one of the most frequently used electronic
                                            formats and, if possible, transfer such Personal Data to another service
                                            provider (rights to data portability);
                                        </li>
                                        <li>to revoke consent of the Data Subject to Processing of Personal
                                            Data.
                                        </li>
                                    </ol>
                                </li>
                                <li>The rights of the Data Subject referred to in Clause 13.1 of the Privacy Policy shall
                                    be exercised insofar as the Processing of Personal Data does not conflict with the
                                    obligations of N1ND GLOBAL under applicable laws, or infringe upon the rights and
                                    freedoms of other individuals, including the right to privacy and data protection.
                                </li>
                                <li>In order to prevent unjustified disclosure of a Data Subject's Personal
                                    Data to third parties, {companyName} exercises rights of a Data Subject on the
                                    basis of a written application, having previously identified the Data Subject.
                                </li>
                                <li><span className='sub-heading' >Application can be submitted in one of the following ways (contact information of
                                    the respective {companyName} is available on its website):</span>
                                    <ol>
                                        <li>
                                            by signing with a qualified secure electronic signature and sending it
                                            to the e-mail address of the respective {companyName};
                                        </li>
                                        <li>upon personal arrival at the office of the respective {companyName} during
                                            its working hours and after verification of identity of the Data Subject
                                            performed by an employee of the {companyName}, to submit the relevant
                                            application;
                                        </li>
                                        <li>by sending a written application to the legal address of the relevant
                                            {companyName}, indicating in the application postal address to which a reply must
                                            be provided. The answer to such application will be provided only by
                                            registered mail, to the postal address indicated in application.
                                        </li>
                                    </ol>
                                </li>
                                <li>Response to the Data Subject's request will be prepared no later than
                                    within one month after receipt of application; if necessary, for objective
                                    reasons, this period may be extended by further two months.
                                </li>
                                <li>In certain cases provided for in regulatory enactments, {companyName} may
                                    not have the right to provide information to the Data Subject about
                                    processing of Personal Data.</li>
                                <li>{companyName} is entitled to refuse to comply with the requirements
                                    specified in the Data Subject's application if the Data Subject unreasonably
                                    refuses to provide his / her identifying information.</li>
                                <li><span className='sub-heading' >{companyName} reserves the right not to issue Personal Data, incl. Personal
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
                                    Processing performed by the respective {companyName} to the Personal Data
                                    Protection Supervisory Authority of the country where the respective {companyName} is
                                    registered, if the Data Subject considers that the Data Subject's
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
                                    Personal Data by {companyName}, please contact {companyName} by sending an e-mail
                                    to: <a className='is-link' href={`mailto:${tenantData?.email || ''}`}>{tenantData?.email || ''}</a>
                                </li>
                            </ol>
                        </li>
                        {/*14*/}
                        <li><span className='heading'>Privacy Policy Availability and Amendments</span>
                            <ol>
                                <li><span>{companyName} is entitled to unilaterally make changes and additions to the
                                    Privacy Policy at any time by publishing the current version of the Privacy
                                    Policy on the {companyName} website {renderWebsites()}
                                </span></li>
                                <li>Privacy Policy is prepared in English and may be translated into other
                                    languages in accordance with the languages of the countries in which
                                    the {companyName} do business.</li>
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
