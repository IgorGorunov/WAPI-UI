import * as React from "react";
import type { SVGProps } from "react";
const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M13.59 7.59c-.38-.38-.89-.59-1.42-.59H7c-1.1 0-1.99.9-1.99 2L5 21c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2h-8z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgFolder;
