import React from "react";
import Footer from "@/components/Footer/Footer";
import "./styles.scss";

type Props = {
  hasHeader?: boolean;
  hasFooter?: boolean;
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({
  hasFooter = false,
  children,
}) => {
  return (
    <div className="main">
      <div className="main-content">
        {children}
      </div>
      {hasFooter && <Footer />}
      <div id="modal-root-main"></div>
      <div id="modal-root-status"></div>
        <div id="modal-root-comment"></div>
    </div
    >
  );
};

export default Layout;
