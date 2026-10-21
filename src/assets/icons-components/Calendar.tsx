import * as React from "react";
import type { SVGProps } from "react";
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M16 2h-1V1c0-.55-.45-1-1-1s-1 .45-1 1v1H5V1c0-.55-.45-1-1-1S3 .45 3 1v1H2C.89 2 .01 2.9.01 4L0 18a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 15c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V7h14zM4 9h2v2H4zm4 0h2v2H8zm4 0h2v2h-2z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCalendar;
