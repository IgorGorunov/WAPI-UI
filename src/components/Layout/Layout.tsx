import React from "react";
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
        {hasHeader && <div>Header</div>}
        {children}
      </div>
      {hasFooter && <Footer />}
    </div>
  );
};

export default Layout;
