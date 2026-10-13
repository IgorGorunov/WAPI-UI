import * as React from "react";
import type { SVGProps } from "react";
const SvgMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#5380F5"
      fillRule="evenodd"
      d="M21 16H9c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgMinus;
