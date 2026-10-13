import * as React from "react";
import type { SVGProps } from "react";
const SvgKeyboardArrowRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="m12.293 18.463 3.88-3.88-3.88-3.88a.996.996 0 0 1 0-1.41.996.996 0 0 1 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgKeyboardArrowRight;
