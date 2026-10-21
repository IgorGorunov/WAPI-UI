import * as React from "react";
import type { SVGProps } from "react";
const SvgBigCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="m12.173 19.163-3.47-3.47a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0l10.58-10.58a.996.996 0 1 0-1.41-1.41z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgBigCheck;
