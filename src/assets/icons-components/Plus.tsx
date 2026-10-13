import * as React from "react";
import type { SVGProps } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#5380F5"
      fillRule="evenodd"
      d="M21 16h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H9c-.55 0-1-.45-1-1s.45-1 1-1h5V9c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPlus;
