import * as React from "react";
import type { SVGProps } from "react";
const SvgCar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="m25.41 13.41-4.83-4.83c-.37-.37-.88-.58-1.41-.58H6a2 2 0 0 0-2 2v7c0 1.1.9 2 2 2 0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3c1.1 0 2-.9 2-2v-2.17c0-.53-.21-1.04-.59-1.42M6 13v-2c0-.55.45-1 1-1h3v4H7c-.55 0-1-.45-1-1m3 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M16 14h-4v-4h4zm5 6.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M18 14v-4h1l4 4z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCar;
