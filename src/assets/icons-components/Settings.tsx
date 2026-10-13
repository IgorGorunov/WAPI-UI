import * as React from "react";
import type { SVGProps } from "react";
const SvgSettings = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      fill="#C3CAD9"
      d="m9.668 2-.492 2.523c-.821.31-1.58.744-2.246 1.291L4.506 4.98 2.174 9.02l1.94 1.686A8 8 0 0 0 4 12c0 .441.045.871.113 1.293l-1.94 1.686 2.333 4.042 2.424-.835c.666.547 1.425.98 2.246 1.29L9.668 22h4.664l.492-2.523c.821-.31 1.58-.744 2.246-1.291l2.424.835 2.332-4.042-1.94-1.686c.07-.422.114-.852.114-1.293s-.045-.871-.113-1.293l1.94-1.686-2.333-4.042-2.424.835a8 8 0 0 0-2.246-1.29L14.332 2zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8"
    />
  </svg>
);
export default SvgSettings;
