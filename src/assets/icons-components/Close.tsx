import * as React from "react";
import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M20.893 8.302a.996.996 0 0 0-1.41 0l-4.89 4.88-4.89-4.89a.996.996 0 1 0-1.41 1.41l4.89 4.89-4.89 4.89a.996.996 0 1 0 1.41 1.41l4.89-4.89 4.89 4.89a.996.996 0 1 0 1.41-1.41l-4.89-4.89 4.89-4.89c.38-.38.38-1.02 0-1.4"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgClose;
