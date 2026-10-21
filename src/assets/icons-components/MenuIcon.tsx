import * as React from "react";
import type { SVGProps } from "react";
const SvgMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={52}
    height={52}
    fill="none"
    style={{
      filter: "drop-shadow(0 1px 2px #5380f5)",
    }}
    {...props}
  >
    <rect width={50} height={50} x={1} y={1} fill="#5380F5" rx={25} />
    <path
      fill="#FFF"
      fillRule="evenodd"
      d="M18 32h16c.55 0 1-.45 1-1s-.45-1-1-1H18c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H18c-.55 0-1 .45-1 1s.45 1 1 1m-1-6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H18c-.55 0-1 .45-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgMenuIcon;
