import * as React from "react";
import type { SVGProps } from "react";
const SvgGalaSettings = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#545D71"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.571 3H18.43A2.566 2.566 0 0 1 21 5.571V18.43A2.566 2.566 0 0 1 18.429 21H5.57A2.566 2.566 0 0 1 3 18.429V5.57A2.566 2.566 0 0 1 5.571 3M6.86 8.855h1.285"
    />
    <path
      stroke="#545D71"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.425 10.142a1.286 1.286 0 1 1 0-2.571 1.286 1.286 0 0 1 0 2.57M10.71 8.856h6.43M17.145 15.285H15.86M14.575 16.571a1.286 1.286 0 1 0 0-2.57 1.286 1.286 0 0 0 0 2.57M13.288 15.285H6.859"
    />
  </svg>
);
export default SvgGalaSettings;
