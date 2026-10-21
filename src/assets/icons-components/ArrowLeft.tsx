import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={10}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M4.78.912 5.133.56l.707.707-.353.353zM1.4 5l-.354.354-.353-.354.353-.353zm4.087 3.38.353.353-.707.708-.353-.354zm0-6.76L1.753 5.353l-.707-.707L4.78.912zM1.753 4.646l3.734 3.733-.707.707-3.734-3.733zM1.4 4.499h12.133v1H1.4z"
    />
  </svg>
);
export default SvgArrowLeft;
