import * as React from "react";
import type { SVGProps } from "react";
const SvgDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M7.2 17.6c0 .88.72 1.6 1.6 1.6h6.4c.88 0 1.6-.72 1.6-1.6v-8c0-.88-.72-1.6-1.6-1.6H8.8c-.88 0-1.6.72-1.6 1.6zm9.6-12h-2l-.568-.568a.8.8 0 0 0-.56-.232h-3.344a.8.8 0 0 0-.56.232L9.2 5.6h-2c-.44 0-.8.36-.8.8s.36.8.8.8h9.6c.44 0 .8-.36.8-.8s-.36-.8-.8-.8"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgDelete;
