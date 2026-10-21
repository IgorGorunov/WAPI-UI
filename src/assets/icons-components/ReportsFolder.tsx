import * as React from "react";
import type { SVGProps } from "react";
const SvgReportsFolder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#8a2be2"
      fillRule="evenodd"
      d="M13 8h4v12h-4zm-2 7H7v5h4zm-6 9v-3h20v3zm18-13h-4v9h4z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgReportsFolder;
