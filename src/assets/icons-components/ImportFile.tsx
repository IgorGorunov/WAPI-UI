import * as React from "react";
import type { SVGProps } from "react";
const SvgImportFile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M5.6 8.4a.936.936 0 0 0-.933.933v12.134c0 1.026.84 1.866 1.867 1.866h12.133c.513 0 .933-.42.933-.933a.936.936 0 0 0-.933-.933h-11.2a.936.936 0 0 1-.933-.934v-11.2A.936.936 0 0 0 5.6 8.4m15.867-3.734h-11.2c-1.027 0-1.867.84-1.867 1.867v11.2c0 1.027.84 1.867 1.867 1.867h11.2c1.027 0 1.867-.84 1.867-1.867v-11.2c0-1.027-.84-1.867-1.867-1.867m-1.867 8.4h-2.8v2.8c0 .514-.42.934-.933.934a.936.936 0 0 1-.933-.934v-2.8h-2.8a.936.936 0 0 1-.934-.933c0-.513.42-.933.934-.933h2.8V8.4c0-.514.42-.934.933-.934s.933.42.933.934v2.8h2.8c.514 0 .934.42.934.933s-.42.934-.934.934"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgImportFile;
