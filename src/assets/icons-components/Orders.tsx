import * as React from "react";
import type { SVGProps } from "react";
const SvgOrders = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#5380F5"
      fillRule="evenodd"
      d="M11 21c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2M5 6c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C8.52 18.37 9.48 20 11 20h11c.55 0 1-.45 1-1s-.45-1-1-1H11l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 24.01 7H9.21l-.67-1.43a.99.99 0 0 0-.9-.57H6c-.55 0-1 .45-1 1m16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgOrders;
