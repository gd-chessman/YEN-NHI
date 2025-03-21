import * as React from "react";
const SvgImage = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#BABEFD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 8h.01M12.5 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6.5M3 16l5-5c.928-.893 2.072-.893 3 0l4 4m-1-1 1-1c.67-.644 1.45-.824 2.182-.54M16 19h6m-3-3v6"
    />
  </svg>
);
export default SvgImage;
