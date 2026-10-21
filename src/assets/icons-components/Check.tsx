import * as React from "react";
import type { SVGProps } from "react";
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={6}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M8 1.2 4.26 4.8 3.015 6 1.768 4.8l.007-.007L0 3.066l1.247-1.2L3.02 3.594 6.754 0z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCheck;
