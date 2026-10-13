import * as React from "react";
import type { SVGProps } from "react";
const SvgAnalytics = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#4C597B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 17h10m-8-4v4m6-4v4M1 2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"
    />
    <path
      stroke="#4C597B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m6 9 3-3 2 2 3-3"
    />
  </svg>
);
export default SvgAnalytics;
