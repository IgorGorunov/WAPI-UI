import * as React from "react";
import type { SVGProps } from "react";
const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M19 4H8c-1.1 0-2 .9-2 2v13c0 .55.45 1 1 1s1-.45 1-1V7c0-.55.45-1 1-1h10c.55 0 1-.45 1-1s-.45-1-1-1m4 4H12c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-1 16h-9c-.55 0-1-.45-1-1V11c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCopy;
