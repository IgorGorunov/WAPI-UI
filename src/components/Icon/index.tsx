import React, { memo, useMemo } from "react";

import { icons } from "./constants";

export type IconType = keyof typeof icons;

export type IconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  name: IconType;
  className?: string;
};

export const Icon: React.FC<IconProps> = memo(({ name = "arrow-left", className = "" }) => {
  const IconComponent = useMemo(() => icons[name], [name]);

  return <IconComponent className={`icon icon-${name} ${className}`} />;
});

Icon.displayName = "Icon";

export default Icon;
