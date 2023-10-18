import React, { memo } from "react";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import classes from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <div className={classes.footer}>
      <div className={classes.wrapper}>
        <div className={classes["footer-left"]}>
          <div className={classes.logo}>
            <LogoWAPI />
          </div>
          <p className={classes.copyright}>
            ©2023 all rights reserved by – WAPI OÜ
          </p>
          <p className={classes.address}>
            Kadaka tee 7, Mustamae linnaosa, Tallinn, 12915 EstoniaWAPI OÜ, Reg
            no. 14699305
          </p>
        </div>
        <div className={classes["footer-right"]}>
          <ul className={classes["footer-links"]}>
            <li>info@wapi.com</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(Footer);
