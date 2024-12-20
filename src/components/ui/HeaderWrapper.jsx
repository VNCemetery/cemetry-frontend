import React from "react";

const HeaderWrapper = ({ children }) => {
  return <div className="z-[999] fixed w-full ">{children}</div>;
};

export default HeaderWrapper;
