import * as React from "react";
import type { SVGProps } from "react";
const SvgExit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#C3CAD9"
      fillRule="evenodd"
      d="M13.79 19.29c.39.39 1.02.39 1.41 0l3.59-3.59a.996.996 0 0 0 0-1.41L15.2 10.7a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41L15.67 14H7c-.55 0-1 .45-1 1s.45 1 1 1h8.67l-1.88 1.88c-.39.39-.38 1.03 0 1.41M22 6H8a2 2 0 0 0-2 2v3c0 .55.45 1 1 1s1-.45 1-1V9c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgExit;
