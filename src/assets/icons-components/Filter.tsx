import * as React from "react";
import type { SVGProps } from "react";
const SvgFilter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      fill="none"
      stroke="#C3CAD9"
      d="M.78 1.35 4.5 5v5.69c0 .37.39.61.72.45l2-1c.17-.09.28-.26.28-.45V5l3.72-3.65a.5.5 0 0 0-.35-.85H1.14a.5.5 0 0 0-.36.85z"
    />
  </svg>
);
export default SvgFilter;
