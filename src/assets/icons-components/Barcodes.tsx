import * as React from "react";
import type { SVGProps } from "react";
const SvgBarcodes = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M21.666 23V7c0-.55-.404-1-.897-1s-.897.45-.897 1v16c0 .55.404 1 .897 1s.897-.45.897-1m-3.588 0V7c0-.55-.403-1-.896-1s-.897.45-.897 1v16c0 .55.404 1 .897 1s.896-.45.896-1m-3.587 0V7c0-.55-.403-1-.896-1-.494 0-.897.45-.897 1v16c0 .55.403 1 .896 1 .494 0 .897-.45.897-1m-3.587 0V7c0-.55-.403-1-.897-1-.493 0-.896.45-.896 1v16c0 .55.403 1 .896 1 .494 0 .897-.45.897-1M6.42 24c.493 0 .897-.45.897-1V7c0-.55-.404-1-.897-1s-.897.45-.897 1v16c0 .55.404 1 .897 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgBarcodes;
