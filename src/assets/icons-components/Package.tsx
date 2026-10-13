import * as React from "react";
import type { SVGProps } from "react";
const SvgPackage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#c3cad9"
      fillRule="evenodd"
      d="M13.777 2.599a3.326 2.936 0 0 0-3.015 0l-7.83 3.518A1.848 1.631 0 0 0 1.922 7.57v8.765c0 .859.547 1.644 1.413 2.036l7.424 3.337a3.326 2.936 0 0 0 3.018 0l7.424-3.337a2.587 2.284 0 0 0 1.413-2.036V7.571c0-.614-.39-1.175-1.01-1.454l-7.827-3.518Zm-2.01 1.744a1.109.979 0 0 1 1.005 0l6.556 2.947-2.17.958-7.101-3.136zM7.599 6.216 5.209 7.29l7.06 3.116 2.41-1.063L7.6 6.216ZM4.14 9.006v7.33c0 .123.078.235.203.291l6.818 3.064v-7.584Zm16.056 7.621-6.818 3.064v-7.584l7.02-3.1v7.33a.37.326 0 0 1-.202.292z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPackage;
