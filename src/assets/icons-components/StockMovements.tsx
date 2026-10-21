import * as React from "react";
import type { SVGProps } from "react";
const SvgStockMovements = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#F63"
      fillRule="evenodd"
      d="M9.644 8.491a.5.5 0 0 1 .35-.623l6.515-1.737a.5.5 0 0 1 .614.362l.756 3.022a.5.5 0 0 0 .606.364l3.03-.758a.5.5 0 0 1 .607.364l1.76 7.04a.5.5 0 0 1-.354.604L13.474 19.87a.5.5 0 0 1-.611-.343zM6.197 9.83l3.065 10.725a3 3 0 1 0 4.7 2.925l12.313-3.519a1 1 0 1 0-.55-1.923L13.6 21.503a3 3 0 0 0-2.415-1.497L7.962 8.726a1 1 0 0 0-.72-.696l-4-1a1 1 0 0 0-.484 1.94z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgStockMovements;
