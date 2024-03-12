import React, {useState} from "react";
import "./styles.scss";


type EmojiPickerPropsType = {
    onEmojiClick: (emoji: string)=>void;
}

export const EMOJI_LIST = ['😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😏',
'😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '🫢', '🫣', '🤫', '🤔', '🫡', '🤤', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '🙃', '🫠', '🤐', '🤨', '😐', '😑', '😶', '🫥',
'😶‍🌫', '😒', '🙄', '😬', '😮‍💨', '🤥', '🫨', '😌', '😔', '😪', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵‍💫', '🤯', '🥱', '😕', '🫤', '😟',
'🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '🥹', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '😤', '😡', '😠', '🤬', '👿', '😈' , '❤️', '🔥', '✅', '👍']

export const EMOJI_CODES = ['\\u{1F60A}','&#128512;', '\\\U0001F603', '\\U0001F604', '&#x1F603;', '\U0001F606', '\U0001F605', '\U0001F923', '\U0001F602', '\U0001F642', '\U0001F609', '\U0001F60A', '\U0001F607', '\U0001F970', '\U0001F60D', '\U0001F929', '\U0001F618', '\U0001F617', '\u263A\ufe0f', '\U0001F61A','\U0001F975', '\U0001F976', '\U0001F92F', '\U0001F911', '\U0001F923', '\U0001F62E', '\U0001F635', '\U0001F624', '\U0001F631', '\U0001F628', '\U0001F975', '\U0001F975\u200d\U0001F91E', '\U0001F975\u200d\U0001F91E', '\U0001F920', '\u2764\ufe0f', '\U0001F525', '\U00002705', '\U0001F44D']
const EmojiPicker: React.FC<EmojiPickerPropsType> = ({ onEmojiClick }) => {


    return (
        <div className="emoji-picker">
            <ul className='emoji-picker__list'>
                {EMOJI_CODES.map((emojiSymbol, index)=>
                    <li key={`emoji_${emojiSymbol}_${index}`} className='emoji-picker__list-item'>
                        <button type='button' className='emoji-btn' onClick={()=>onEmojiClick(emojiSymbol)}>{emojiSymbol}</button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default EmojiPicker;
