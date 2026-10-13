import * as React from "react";
import type { SVGProps } from "react";
const SvgHistory = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15 5C9.5 5 5 9.5 5 15s4.5 10 10 10 10-4.5 10-10S20.5 5 15 5m3.55 13.8-4.08-2.51c-.3-.18-.48-.5-.48-.85v-4.69a.77.77 0 0 1 .76-.75c.41 0 .75.34.75.75v4.45l3.84 2.31c.36.22.48.69.26 1.05-.22.35-.69.46-1.05.24"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgHistory;
