import * as React from "react";
import type { SVGProps } from "react";
const SvgClockOutline = (props: SVGProps<SVGSVGElement>) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   {...props}
  // >
  //   <path
  //     fill="#545D71"
  //     d="M12 20a8 8 0 1 0 0-16.001A8 8 0 0 0 12 20m0-18a10 10 0 1 1 0 20C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67-.75 1.23L11 13V7z"
  //   />
  // </svg>
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
//   <path stroke="#545D71" d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M16 14L12 12V7M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#545D71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);
export default SvgClockOutline;
