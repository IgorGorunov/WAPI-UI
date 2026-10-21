import * as React from "react";
import type { SVGProps } from "react";
const SvgTicket = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#D8B438"
      fillRule="evenodd"
      d="M23 5H7c-1.1 0-1.99.9-1.99 2L5 25l4-4h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m-13 7h10c.55 0 1 .45 1 1s-.45 1-1 1H10c-.55 0-1-.45-1-1s.45-1 1-1m6 5h-6c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1m4-6H10c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgTicket;
