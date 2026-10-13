import * as React from "react";
import type { SVGProps } from "react";
const SvgCloseInCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <rect width={40} height={40} fill="#000" fillOpacity={0.1} rx={20} />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M25.5 13.749a.93.93 0 0 0-1.316 0l-4.564 4.555-4.564-4.564a.93.93 0 1 0-1.316 1.316l4.564 4.564-4.564 4.564a.93.93 0 1 0 1.316 1.316l4.564-4.564 4.564 4.564a.93.93 0 1 0 1.316-1.316l-4.564-4.564 4.564-4.564a.935.935 0 0 0 0-1.307"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCloseInCircle;
