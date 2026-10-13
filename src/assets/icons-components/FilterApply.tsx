import * as React from "react";
import type { SVGProps } from "react";
const SvgFilterApply = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 3H2l8 9v7.2l4 1.8v-9z"
    />
    <path
      stroke="transparent"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m13 15 4.2 4.2 4.3-5.7"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="m13 15 4.2 4.2 4.3-5.7"
    />
  </svg>
);
export default SvgFilterApply;
