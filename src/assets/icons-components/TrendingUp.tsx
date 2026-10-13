import * as React from "react";
import type { SVGProps } from "react";
const SvgTrendingUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#29CC39"
      fillRule="evenodd"
      d="m19.433 9.85 1.44 1.44-4.88 4.88-3.29-3.29a.996.996 0 0 0-1.41 0l-6 6.01a.996.996 0 1 0 1.41 1.41l5.29-5.3 3.29 3.29c.39.39 1.02.39 1.41 0l5.59-5.58 1.44 1.44a.5.5 0 0 0 .85-.35V9.5a.48.48 0 0 0-.49-.5h-4.29a.5.5 0 0 0-.36.85"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgTrendingUp;
