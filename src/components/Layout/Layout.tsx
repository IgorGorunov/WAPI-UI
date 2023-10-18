import React from "react";
import Footer from "@/components/Footer/Footer";
import classes from "./Layout.module.scss";

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
    <div className={classes.main}>
      <div className={classes.content}>
        {hasHeader && <div>Htader</div>}
        {children}
      </div>
      {hasFooter && <Footer />}
    </div>
  );
};

export default Layout;
