import * as React from "react";
import type { SVGProps } from "react";
const SvgEdit = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clip-path="url(#clip0_429_11139)">
        <path d="M5 16L4 20L8 19L19.5858 7.41421C20.3668 6.63316 20.3668 5.36683 19.5858 4.58579L19.4142 4.41421C18.6332 3.63316 17.3668 3.63317 16.5858 4.41421L5 16Z" stroke="inherit" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 6L18 9" stroke="inherit" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 20H21" stroke="inherit" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_429_11139">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   {...props}
  // >
  //   <path
  //     fill="#C3CAD9"
  //     fillRule="evenodd"
  //     d="M20.75 10.002 17 6.252l-9.85 9.85q-.15.15-.15.36V19.5c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15zm2.96-2.96a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0L18 5.252l3.75 3.75zM5 23h20c1.1 0 2 .9 2 2s-.9 2-2 2H5c-1.1 0-2-.9-2-2s.9-2 2-2"
  //     clipRule="evenodd"
  //   />
  // </svg>
);
export default SvgEdit;
