import * as React from "react";
import type { SVGProps } from "react";
const SvgMastercard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={65}
    height={40}
    fill="none"
    {...props}
  >
    <g clipPath="url(#mastercard_svg__a)">
      <rect width={65} height={40} fill="url(#mastercard_svg__b)" rx={3} />
      <path
        fill="#fff"
        d="m8.84 9.89 1.339 2.481 1.338-2.48h1.674l-2.065 3.525L13.246 17h-1.69l-1.377-2.53L8.802 17h-1.7l2.125-3.584-2.07-3.525zm6.349 0 1.337 2.481 1.338-2.48h1.675l-2.065 3.525L19.593 17h-1.69l-1.377-2.53L15.15 17H13.45l2.124-3.584-2.07-3.525zm6.347 0 1.338 2.481 1.338-2.48h1.675l-2.066 3.525L25.941 17h-1.69l-1.377-2.53L21.497 17h-1.7l2.125-3.584-2.07-3.525zm6.348 0 1.338 2.481 1.338-2.48h1.674l-2.065 3.525L32.289 17h-1.69l-1.377-2.53L27.845 17h-1.7l2.125-3.584-2.07-3.525z"
      />
      <path fill="#FF5F00" d="M50.653 32.746h-6.238v-11.21h6.238z" />
      <path
        fill="#EB001B"
        d="M44.811 27.14c0-2.273 1.065-4.299 2.723-5.604A7.129 7.129 0 0 0 36 27.141a7.129 7.129 0 0 0 11.534 5.605 7.12 7.12 0 0 1-2.723-5.605"
      />
      <path
        fill="#F79E1B"
        d="M59.069 27.14a7.129 7.129 0 0 1-11.535 5.606 7.12 7.12 0 0 0 2.723-5.605c0-2.274-1.064-4.3-2.723-5.605a7.129 7.129 0 0 1 11.534 5.605"
      />
    </g>
    <defs>
      <linearGradient
        id="mastercard_svg__b"
        x1={10.635}
        x2={-2.04}
        y1={-9.766}
        y2={58.601}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFA346" />
        <stop offset={1} stopColor="#F2E32E" />
      </linearGradient>
      <clipPath id="mastercard_svg__a">
        <path fill="#fff" d="M0 0h65v40H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgMastercard;
