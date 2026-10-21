import * as React from "react";
import type { SVGProps } from "react";
const SvgTrackChanges = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M15 5c-3.87 0-7 3.13-7 7 0 4.17 4.42 9.92 6.24 12.11.4.48 1.13.48 1.53 0C17.58 21.92 22 16.17 22 12c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgTrackChanges;
