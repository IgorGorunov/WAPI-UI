import * as React from "react";
import type { SVGProps } from "react";
const SvgProfile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M15 5C9.48 5 5 9.48 5 15s4.48 10 10 10 10-4.48 10-10S20.52 5 15 5m0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3m0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgProfile;
