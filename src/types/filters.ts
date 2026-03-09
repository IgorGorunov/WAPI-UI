import type {OptionType} from "@/types/forms";
import type {IconType} from "@/components/Icon";
import type {FILTER_TYPE} from "@/types/utility";

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
    icon?: IconType;
    isCountry?: boolean;
}

// export type FilterType = {
//     name: string;
//     count: number;
// }

export type FilterType = {
    id?: string;
    name: string;
    count: number;
}

export type BaseFilterMetadata = {
    [key: string]: number | FilterType[];
};

export type BaseFiltersSelected = {
    [key: string]: string[] | boolean | string | number | undefined;
};