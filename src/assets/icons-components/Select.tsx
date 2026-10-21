import * as React from "react";
import type { SVGProps } from "react";
const SvgSelect = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15 5C9.48 5 5 9.48 5 15s4.48 10 10 10 10-4.48 10-10S20.52 5 15 5m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.88-11.71L13 17.17l-1.88-1.88a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l2.59 2.59c.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSelect;
