import * as React from "react";
import type { SVGProps } from "react";
const SvgWhitelabel = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <circle cx={50} cy={50} r={44} fill="none" stroke="#000" strokeWidth={8} />
    <text
      x="50%"
      y="50%"
      dy=".35em"
      fontFamily="Arial, sans-serif"
      fontSize={64}
      fontWeight="bold"
      textAnchor="middle"
    >
      {"W"}
    </text>
  </svg>
);
export default SvgWhitelabel;
