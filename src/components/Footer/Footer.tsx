import React, { memo } from "react";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import "./styles.scss";
import Link from "next/link";
import {Routes} from "@/types/routes";
import {useTranslations} from "next-intl";

const Footer: React.FC = () => {
  const t = useTranslations('Footer');

  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="footer-left">
          <div className="logo">
            <LogoWAPI />
          </div>
          <p className="copyright">
            {`©2024 ${t('allRightsReservedBy')}`}
          </p>
          <p className="address">
            {t('address')}
          </p>
        </div>
        <div className="footer-right">
          <ul className="footer-links">
            <li><a className='is-footer-link' href="mailto:info@wapi.com">info@wapi.com</a></li>
            <li><Link className='is-footer-link' href={Routes.PrivacyPolicy}>{t('privacyPolicy')}</Link></li>
            <li><Link className='is-footer-link' href={Routes.CookiePolicy}>{t('cookiePolicy')}</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(Footer);
