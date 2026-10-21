import * as React from "react";
import type { SVGProps } from "react";
const SvgIssue = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} {...props}>
    <path
      fill="#c3cad9"
      fillRule="evenodd"
      d="M9.976 18.846c-4.925 0-8.918-3.917-8.918-8.75 0-4.832 3.993-8.75 8.918-8.75s8.918 3.918 8.918 8.75c0 4.833-3.993 8.75-8.918 8.75m0-1.75c3.94 0 7.135-3.134 7.135-7s-3.195-7-7.135-7-7.135 3.134-7.135 7 3.195 7 7.135 7m.892-1.75H9.084v-1.75h1.784zm0-2.625H9.084V4.846h1.784z"
    />
  </svg>
);
export default SvgIssue;
