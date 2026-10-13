import * as React from "react";
import type { SVGProps } from "react";
const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M11.2 8h1.6v1.6h-1.6zm.8 8c.44 0 .8-.36.8-.8V12c0-.44-.36-.8-.8-.8s-.8.36-.8.8v3.2c0 .44.36.8.8.8m0-12c-4.416 0-8 3.584-8 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8m0 14.4A6.41 6.41 0 0 1 5.6 12c0-3.528 2.872-6.4 6.4-6.4s6.4 2.872 6.4 6.4-2.872 6.4-6.4 6.4"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgInfo;
