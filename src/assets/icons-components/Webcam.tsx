import * as React from "react";
import type { SVGProps } from "react";
const SvgWebcam = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="webcam_svg__Icons"
    viewBox="0 0 32 32"
    {...props}
  >
    <style>
      {
        ".webcam_svg__st0{fill:none;stroke:#c3cad9;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}"
      }
    </style>
    <circle cx={16} cy={14} r={5} className="webcam_svg__st0" />
    <circle cx={16} cy={14} r={1} className="webcam_svg__st0" />
    <path
      d="m20.3 23.3 2 2.4c1.1 1.3.1 3.3-1.5 3.3h-9.5c-1.7 0-2.6-2-1.5-3.3l2-2.4M27 23H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h22c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2M25 9h-2"
      className="webcam_svg__st0"
    />
  </svg>
);
export default SvgWebcam;
