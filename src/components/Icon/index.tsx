import React, { memo, useMemo } from "react";

import ArrowRight from "../../assets/icons/arrow-right.svg";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import MenuIcon from "@/assets/icons/MenuIcon.svg";
import Notification from "@/assets/icons/notifications.svg";
import BGLogo from "@/assets/icons/bg-logo.svg";
import Search from "@/assets/icons/search.svg";
import Home from "@/assets/icons/home.svg";

export const icons = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "menu-icon": MenuIcon,
  notification: Notification,
  "bg-logo": BGLogo,
  "search": Search,
  "home": Home,
};

export type IconType = keyof typeof icons;

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  name: IconType;
};

export const Icon: React.FC<IconProps> = memo(({ name = "arrow-left" }) => {
  const IconComponent = useMemo(() => icons[name], [name]);

  return <IconComponent />;
});

Icon.displayName = "Icon";

export default Icon;
