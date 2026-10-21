import * as React from "react";
import type { SVGProps } from "react";
const SvgRemoveTableRow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#f08080"
      fillRule="evenodd"
      d="M10 15c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1h-8c-.55 0-1 .45-1 1m5-10C9.48 5 5 9.48 5 15s4.48 10 10 10 10-4.48 10-10S20.52 5 15 5m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgRemoveTableRow;
