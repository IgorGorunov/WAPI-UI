import * as React from "react";
import type { SVGProps } from "react";
const SvgProducts = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#29CC39"
      fillRule="evenodd"
      d="M8 17h2c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1m0 5h2c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1m0-10h2c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1m5 5h10c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H13c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1m0 5h10c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H13c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1M12 9v2c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H13c-.55 0-1 .45-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgProducts;
