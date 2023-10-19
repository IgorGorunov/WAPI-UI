import React, { memo } from "react";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import "./styles.scss";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="footer-left">
          <div className="logo">
            <LogoWAPI />
          </div>
          <p className="copyright">
            ©2023 all rights reserved by – WAPI OÜ
          </p>
          <p className="address">
            Kadaka tee 7, Mustamae linnaosa, Tallinn, 12915 EstoniaWAPI OÜ, Reg
            no. 14699305
          </p>
        </div>
        <div className="footer-right">
          <ul className="footer-links">
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
