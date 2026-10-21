import * as React from "react";
import type { SVGProps } from "react";
const SvgNotifications = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <g filter="url(#notifications_svg__a)">
      <rect width={50} height={50} x={5} y={3} fill="#fff" rx={25} />
      <path
        fill="#C3CAD9"
        fillRule="evenodd"
        d="M29.587 37.5c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2m6-6v-5c0-3.07-1.64-5.64-4.5-6.32v-.68c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-2.87.68-4.5 3.24-4.5 6.32v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <filter
        id="notifications_svg__a"
        width={60}
        height={60}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={2.5} />
        <feColorMatrix values="0 0 0 0 0.14902 0 0 0 0 0.2 0 0 0 0 0.301961 0 0 0 0.03 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_907_9481"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_907_9481"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgNotifications;
