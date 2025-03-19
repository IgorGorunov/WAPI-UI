import React, { memo } from "react";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import "./styles.scss";
import Link from "next/link";
import {Routes} from "@/types/routes";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="footer-left">
          <div className="logo">
            <LogoWAPI />
          </div>
          <p className="copyright">
            ©{(new Date).getFullYear()} all rights reserved by – WAPI OÜ
          </p>
          <p className="address">
            Kadaka tee 7, Mustamae linnaosa, Tallinn, 12915 Estonia WAPI OÜ, Reg
            no. 14699305
          </p>
        </div>
        <div className="footer-right">
          <ul className="footer-links">
            <li><a className='is-footer-link' href="mailto:info@wapi.com">info@wapi.com</a></li>
            <li><Link className='is-footer-link' href={Routes.PrivacyPolicy}>Privacy Policy</Link></li>
            <li><Link className='is-footer-link' href={Routes.CookiePolicy}>Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(Footer);
