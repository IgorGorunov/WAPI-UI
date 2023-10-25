import React, { memo, useMemo } from "react";

import ArrowRight from "../../assets/icons/arrow-right.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import MenuIcon from "@/assets/icons/MenuIcon.svg";
import Notification from "@/assets/icons/notifications.svg";
import BGLogo from "@/assets/icons/bg-logo.svg";
import Search from "@/assets/icons/search.svg";
import Home from "@/assets/icons/home.svg";
import Close from "@/assets/icons/close.svg";
import Products from "@/assets/icons/products.svg";
import KeyboardArrowUp from "@/assets/icons/keyboard_arrow_up.svg";
import KeyboardArrowRight from "@/assets/icons/keyboard_arrow_right.svg";
import Expand from "@/assets/icons/expand.svg";


export const icons = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "menu-icon": MenuIcon,
  notification: Notification,
  "bg-logo": BGLogo,
  "search": Search,
  "home": Home,
  "close": Close,
  "products": Products,
  "keyboard-arrow-up": KeyboardArrowUp,
  "keyboard-arrow-right": KeyboardArrowRight,
  'expand': Expand,
};

export type IconType = keyof typeof icons;

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  name: IconType;
  className?: string;
};

export const Icon: React.FC<IconProps> = memo(({ name = "arrow-left", className="" }) => {
  const IconComponent = useMemo(() => icons[name], [name]);

  return <IconComponent className={className}/>;
});

Icon.displayName = "Icon";

export default Icon;
