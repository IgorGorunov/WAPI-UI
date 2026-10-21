import * as React from "react";
import type { SVGProps } from "react";
const SvgFillDoc = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#FFF"
      fillRule="evenodd"
      d="M12.21 14H14v9c0 .55.45 1 1 1s1-.45 1-1v-9h1.79c.45 0 .67-.54.35-.85l-2.79-2.79c-.2-.2-.51-.2-.71 0l-2.79 2.79a.5.5 0 0 0 .36.85M7 7c0 .55.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgFillDoc;
