import React, {useState} from "react";
import "./styles.scss";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/FormBuilder/Checkbox";

type NDAPropsType = {
    handleSignNDA: ()=>void;
}

const NDA: React.FC<NDAPropsType> = ({handleSignNDA}) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    return (
        <div className={`lead-page__prices--NDA`}>
            <div className={`card lead-page__prices--NDA-text has-scroll`}>
                <p className='title-h4'>MUTUAL NON-DISCLOSURE AGREEMENT</p>
                <p>Confidential information is any kind of information about the Party that is not publicly available, which has also been transferred or became known to the other Party in any way before the conclusion of the Agreement or during the execution of the Agreement, as well as any other information, including financial information (such as the Party's prices and markups) and/or which has been designated by the Party as confidential in writing. The Parties shall be responsible for compliance with confidentiality obligations and shall be prohibited from disclosing confidential information to the third parties. The disclosure of confidential information shall mean the transfer of confidential information to the third parties in any way. If one of the Parties violates confidentiality obligations, the Party whose interests have been violated shall be entitled to demand recovery of damages and penalty of EUR 10,000.00.</p>
                {/*<p>As part of discussions relating to a possible business relationship between Wapi OÜ (the Discloser) and the Recipient (the "Parties"), Discloser will disclose to Recipient certain Confidential Information, as defined below, Now therefore, in consideration of the mutual promises herein, the Parties agree as follows:</p>*/}
                {/*<ol className='lead-page__prices--NDA-text__list'>*/}
                {/*    <li>For the purpose of this Agreement, the term Confidential Information shall mean any and all*/}
                {/*        information, in tangible (paper, disk or other) or non-tangible (oral or visual) form, whether*/}
                {/*        of a financial, commercial, technical or other nature, including without limitation, inventions,*/}
                {/*        know-how, trade-secrets, intellectual property, customers, suppliers, baking institutions*/}
                {/*        information, payment processing institutions information, contracts, budgets, plans and all*/}
                {/*        other information relating to the Discloser's and/or its affiliates business and operations*/}
                {/*        whether identified at the time of disclosure as proprietary or confidential or which a*/}
                {/*        reasonable person would recognize from the surrounding facts and circumstances to be proprietary*/}
                {/*        or confidential (“Confidential Information”).*/}
                {/*    </li>*/}
                {/*    <li>The Recipient shall maintain the Confidential Information in confidence, and protect it from*/}
                {/*        disclosure, using the same degree of care, but no less than a reasonable degree of care, as the*/}
                {/*        Recipient uses to protect its own confidential information.*/}
                {/*    </li>*/}
                {/*    <li>The Recipient may use the Confidential Information only for the purpose of evaluating the*/}
                {/*        possible business relationship between the Parties and shall prevent any other use,*/}
                {/*        dissemination, communication, or publication of the Confidential Information. The Recipient may*/}
                {/*        only provide the Confidential Information to its employees having a need to know, provided that*/}
                {/*        they are bound by a confidentiality agreement with the Recipient no less restrictive than this*/}
                {/*        Agreement. The Recipient shall be responsible for any breach of the Agreement made by its*/}
                {/*        employees if the Recipient itself had made such breach.*/}
                {/*    </li>*/}
                {/*    <li>The Recipient's obligations pursuant to this Agreement shall not apply with respect to*/}
                {/*        Confidential Information which the Recipient can prove: (a) was known to the Recipient before*/}
                {/*        receipt from Discloser; (b) is or becomes a matter of public knowledge through no fault of the*/}
                {/*        Recipient; (c) is rightfully received by the Recipient from a third party which owes no*/}
                {/*        obligation of confidentiality to the Discloser; or (d) is independently developed by the*/}
                {/*        Recipient.*/}
                {/*    </li>*/}
                {/*    <li>Specific information disclosed as part of Confidential Information shall not be considered available to the general public or in the prior possession of the Recipient merely because it is embraced by more general information available to the general public or in the prior possession of the Recipient.</li>*/}
                {/*    <li>If the Recipient is required to disclose Confidential Information to a government body or court of law, the Recipient agrees to give the Discloser notice so that the Discloser may contest the disclosure or obtain a protective order. The Recipient shall only disclose that portion of the Confidential Information that the Recipient is legally obligated to do so. The Recipient shall use its best efforts to have such disclosed Confidential Information treated as confidential.</li>*/}
                {/*    <li>This Agreement shall commence on the Effective Date and will cover all Confidential Information disclosed within 36 months thereof.</li>*/}
                {/*    <li>The Recipient’s obligations hereunder respecting any particular Confidential Information disclosed hereunder shall continue perpetually and survive termination hereof.</li>*/}
                {/*    <li>The Recipient does not acquire any intellectual property rights or licenses under this Agreement, or rights to use the Confidential Information disclosed under this Agreement, except in accordance with the limited right of use set out in section 3 above.</li>*/}
                {/*    <li>The Recipient shall not reverse engineer, or use the design or ideas or technologies embodied in the Confidential Information, nor shall it manufacture and/or allow others to copy, use, reverse engineer or manufacture the Confidential Information or any embodied or related technology or ideas.</li>*/}
                {/*    <li>The Recipient shall make no copies of any of the Discloser's Confidential Information without the prior written consent of the Discloser, such consent to be given or withheld at the Discloser's sole*/}
                {/*        discretion. Upon the completion or abandonment of the contemplated business relationship and in any event, upon the written request of the Discloser at any time, whether before or after the completion or abandonment of such relationship, the Recipient shall return promptly to the Discloser all Confidential Information along with all copies, extracts and other objects or items in which it may be contained or embodied, or at the Discloser’s option, shall destroy all such material.</li>*/}
                {/*    <li>During the term of the Agreement and after the date of termination of the Agreement, the Parties undertake within two years not to conclude cooperation agreements, service agreements or other company agreements with the companies that are the clients of the other Party, that is, the Parties undertake not to carry out any direct or indirect cooperation and entrepreneurial activities with the clients of the other Party. The Parties undertake to communicate with the clients of the other Party during the term of the Agreement only through the mediation of the other Party and only with the consent of the other Party. During the term of the Agreement and after the date of termination of the Agreement, the Parties undertake not to hire away the employees of the other Party and not to conclude any cooperation agreements with the clients of the other Party within two years. If the Party violates the terms specified in this paragraph, the other Party shall be entitled to impose a penalty in the amount of EUR 100,000.00.</li>*/}
                {/*    <li>The Recipient recognizes that all Confidential Information furnished under this Agreement is provided by the Discloser on an “as is” basis and the Discloser makes no representations or warranties hereunder, whether express or implied with respect thereto. The Recipient agrees that the Discloser shall not have any liability to the Recipient arising from the Confidential Information.</li>*/}
                {/*    <li>Nothing in this Agreement shall be deemed to obligate the Discloser to disclose any information to the Recipient, or to negotiate or enter into any agreement or relationship with the Recipient.</li>*/}
                {/*    <li>The Recipient acknowledges and agrees that due to the unique nature of the Confidential Information, any breach of this Agreement may cause irreparable harm to the Discloser for which damages are not an adequate remedy. The Recipient agrees that, in addition to all other remedies provided at law or in equity, the Discloser shall be entitled to injunctive relief hereunder.</li>*/}
                {/*    <li>The Recipient may not at any time assign or transfer any of its legal, beneficial or other rights, benefits and/or obligations under this Agreement without the prior written consent of the Discloser.</li>*/}
                {/*    <li>This Agreement shall be governed by, interpreted and construed in accordance with the laws of Latvia.</li>*/}
                {/*    <li>This Agreement consists of the entire agreement and understanding between the Parties with respect to the subject matter hereof and supersedes all prior written or oral agreements with respect hereto. This Agreement may not be modified except by written instrument signed by a duly authorized representative of each party hereto.</li>*/}

                {/*</ol>*/}
                {/*<p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."*/}
                {/*</p><p>*/}
                {/*    Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC*/}
                {/*    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"*/}
                {/*</p><p>*/}
                {/*    1914 translation by H. Rackham*/}
                {/*    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"*/}
                {/*</p><p>*/}
                {/*    Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC*/}
                {/*    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>*/}

                <div className='lead-page__prices--NDA-confirm-checkbox'>
                    <Checkbox name='ndaConfirmed' label='I have carefully reviewed the Non-Disclosure Agreement (NDA) and consent to its terms and conditions.' value={isConfirmed} onChange={(val: React.ChangeEvent<HTMLInputElement>)=>setIsConfirmed(val.target.checked)} />
                </div>
            </div>
            <Button classNames='lead-page__prices--NDA-confirm-btn' disabled={!isConfirmed} onClick={() => {handleSignNDA()}}>Sign NDA</Button>
        </div>
    );
};

export default NDA;
