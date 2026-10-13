import * as React from "react";
import type { SVGProps } from "react";
const SvgSelection = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M20 23H8c-.55 0-1-.45-1-1V10c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1m3-18H11c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 10-2.5-1.5L18 15V7h5z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSelection;
