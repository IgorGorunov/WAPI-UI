import {OptionType} from "@/types/forms";

export const getSellerName = (sellersList: OptionType[], sellerUid: string) => {
    const t = sellersList.find(item=>item.value===sellerUid);
    return t ? t.label : ' - ';
};