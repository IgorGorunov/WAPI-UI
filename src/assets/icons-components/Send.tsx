import * as React from "react";
import type { SVGProps } from "react";
const SvgSend = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#3361FF"
      fillRule="evenodd"
      d="m6.4 23.885 17.45-7.48a1 1 0 0 0 0-1.84L6.4 7.085a.993.993 0 0 0-1.39.91L5 12.605c0 .5.37.93.87.99L20 15.485l-14.13 1.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSend;
