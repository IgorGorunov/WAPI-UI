import * as React from "react";
import type { SVGProps } from "react";
const SvgExpand = (props: SVGProps<SVGSVGElement>) => (
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
      d="m18.463 12.293-3.88 3.88-3.88-3.88a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgExpand;
