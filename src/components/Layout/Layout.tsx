import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer/Footer";
import "./styles.scss";

type Props = {
  hasHeader?: boolean;
  hasFooter?: boolean;
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({
  hasHeader = false,
  hasFooter = false,
  children,
}) => {
  return (
    <div className="main">
      <div className="main-content">
        {/*{hasHeader && <Header />}*/}
        {children}
      </div>
      {hasFooter && <Footer />}
      <div id="modal-root"></div>
    </div>
  );
};

export default Layout;
