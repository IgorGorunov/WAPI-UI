import * as React from "react";
import type { SVGProps } from "react";
const SvgBundle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M15.089 5.896c-2.01-2.01-5.02-2.42-7.44-1.24l3.63 3.63c.39.39.39 1.02 0 1.41l-1.59 1.59c-.39.4-1.02.4-1.41 0l-3.63-3.63c-1.17 2.43-.76 5.42 1.25 7.43a6.51 6.51 0 0 0 6.89 1.48l7.96 7.96a2.613 2.613 0 0 0 3.71 0 2.613 2.613 0 0 0 0-3.71l-7.92-7.93c.92-2.34.44-5.1-1.45-6.99"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgBundle;
