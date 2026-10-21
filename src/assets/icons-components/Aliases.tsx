import * as React from "react";
import type { SVGProps } from "react";
const SvgAliases = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26 9V5c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H10V5c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h1v10H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1h-1V10h1c.55 0 1-.45 1-1M6 6h2v2H6zm2 18H6v-2h2zm12-2H10v-1c0-.55-.45-1-1-1H8V10h1c.55 0 1-.45 1-1V8h10v1c0 .55.45 1 1 1h1v10h-1c-.55 0-1 .45-1 1zm4 2h-2v-2h2zM22 8V6h2v2zm-6.06 2.65a1.02 1.02 0 0 0-.95-.65c-.42 0-.8.26-.94.65l-2.77 7.33c-.19.49.17 1.02.7 1.02.32 0 .6-.2.71-.5l.55-1.5h3.49l.56 1.51c.11.29.39.49.71.49h.01c.53 0 .89-.53.71-1.02zm-2.25 5.09L15 11.91l1.3 3.83z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgAliases;
