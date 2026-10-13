import * as React from "react";
import type { SVGProps } from "react";
const SvgGoods = (props: SVGProps<SVGSVGElement>) => (
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
      d="M25 12.013h-4.79l-4.39-6.57a1 1 0 0 0-1.66 0l-4.39 6.57H5c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27.03-.27c0-.55-.45-1-1-1m-10.01-4.21 2.81 4.21h-5.62zm.01 12.21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgGoods;
