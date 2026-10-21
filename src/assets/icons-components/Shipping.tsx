import * as React from "react";
import type { SVGProps } from "react";
const SvgShipping = (props: SVGProps<SVGSVGElement>) => (
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
      d="M22.5 11H20V9c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2 0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h1c.55 0 1-.45 1-1v-3.33c0-.43-.14-.85-.4-1.2l-2.3-3.07c-.19-.25-.49-.4-.8-.4M9 21c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m13.5-8.5 1.96 2.5H20v-2.5zM21 21c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgShipping;
