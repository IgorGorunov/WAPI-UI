import * as React from "react";
import type { SVGProps } from "react";
const SvgQuestion = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    className="question_svg__svg-icon"
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path
      fill="#C3CAD9"
      d="M512 938.667C276.352 938.667 85.333 747.648 85.333 512S276.352 85.333 512 85.333 938.667 276.352 938.667 512 747.648 938.667 512 938.667m0-85.334a341.333 341.333 0 1 0 0-682.666 341.333 341.333 0 0 0 0 682.666m-42.667-170.666h85.334V768h-85.334zm0-84.992s85.334-.342 85.334 0c0-42.752 128-85.675 128-171.008 0-94.294-75.648-170.667-170.283-170.667a170.667 170.667 0 0 0-171.05 170.667h85.333c0-46.934 38.4-85.334 85.333-85.334s85.333 38.4 85.333 85.334c0 38.4-128 100.992-128 171.008"
    />
  </svg>
);
export default SvgQuestion;
