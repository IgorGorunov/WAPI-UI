import * as React from "react";
import type { SVGProps } from "react";
const SvgGeneral = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={18}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M9.708 4V2c0-1.1-.85-2-1.89-2H2.144C1.105 0 .254.9.254 2v14c0 1.1.85 2 1.89 2h15.127c1.04 0 1.891-.9 1.891-2V6c0-1.1-.85-2-1.89-2zM4.036 16H2.145v-2h1.89zm0-4H2.145v-2h1.89zm0-4H2.145V6h1.89zm0-4H2.145V2h1.89zm3.781 12h-1.89v-2h1.89zm0-4h-1.89v-2h1.89zm0-4h-1.89V6h1.89zm0-4h-1.89V2h1.89zm8.509 12H9.708v-2h1.89v-2h-1.89v-2h1.89V8h-1.89V6h6.618c.52 0 .945.45.945 1v8c0 .55-.425 1-.945 1m-.946-8h-1.89v2h1.89zm0 4h-1.89v2h1.89z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgGeneral;
