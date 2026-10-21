import * as React from "react";
import type { SVGProps } from "react";
const SvgFile = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props}>
    <path d="M7 2v46h36V14.594l-.281-.313-12-12L30.406 2Zm2 2h20v12h12v30H9Zm22 1.438L39.563 14H31Z" />
  </svg>
);
export default SvgFile;
