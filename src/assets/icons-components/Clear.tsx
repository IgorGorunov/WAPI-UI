import * as React from "react";
import type { SVGProps } from "react";
const SvgClear = (props: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} aria-hidden="true" {...props}>
    <path
      fill="#C3CAD9"
      d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698"
    />
  </svg>
);
export default SvgClear;
