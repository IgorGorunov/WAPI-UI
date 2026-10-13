import * as React from "react";
import type { SVGProps } from "react";
const SvgSku = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M19.838 6H7.284c-.996 0-1.794.9-1.794 2v14c0 1.1.798 2 1.794 2h12.554c.986 0 1.793-.9 1.793-2V8c0-1.1-.807-2-1.793-2m-2.69 10h-2.69v3c0 .55-.404 1-.897 1s-.897-.45-.897-1v-3h-2.69c-.493 0-.897-.45-.897-1s.404-1 .897-1h2.69v-3c0-.55.404-1 .897-1s.897.45.897 1v3h2.69c.493 0 .897.45.897 1s-.404 1-.897 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSku;
