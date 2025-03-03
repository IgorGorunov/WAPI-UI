import {OptionType} from "@/types/forms";
import {IconType} from "@/components/Icon";
import {FILTER_TYPE} from "@/types/utility";

export type FilterComponentType = {
    filterTitle: string;
    iconName?: IconType;
    filterType?: FILTER_TYPE;
    filterDescriptions?: string;
    filterOptions: OptionType[];
    filterState: string[];
    setFilterState: (val: string[])=>void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onClose: ()=>void;
    onClick: ()=>void;
}