import * as React from "react";
import type { SVGProps } from "react";
const SvgTrouble = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#c3cad9"
      strokeWidth={1.5}
      d="M6.165 10.771c2.582-4.793 3.873-7.19 5.917-7.19s3.334 2.397 5.916 7.19l.322.597c2.145 3.983 3.217 5.975 2.248 7.43-.97 1.457-3.368 1.457-8.165 1.457h-.643c-4.797 0-7.195 0-8.165-1.456s.103-3.448 2.249-7.43z"
    />
    <path
      stroke="#c3cad9"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M12.082 8.213v4.632"
    />
    <ellipse
      cx={12.082}
      cy={15.624}
      fill="#c3cad9"
      rx={0.885}
      ry={0.926}
      style={{
        strokeWidth: 0.905197,
      }}
    />
  </svg>
);
export default SvgTrouble;
