import React, { memo } from "react";
import LogoWAPI from "@/assets/icons/LogoWAPI.svg";
import "./styles.scss";
import {Routes} from "@/types/routes";
import useTenant from "@/context/tenantContext";
import {TENANT_TYPE, TenantFooterDataType, TENANTS} from "@/lib/tenants";
import Image from 'next/image';
import Link from "next/link";


const LogoInFooter:React.FC = (tenant:TENANT_TYPE, footer: TenantFooterDataType | null) => {

  if (tenant === TENANTS.WAPI) return <LogoWAPI />;

  if (footer?.logo) {
    return <Image src={footer.logo} alt="logo" width={footer?.logoWidth || 200} height={footer?.logoHeight || 120} />;
  }

  return null;
}

const Footer: React.FC = () => {
  const {tenant, tenantData} = useTenant();
  const footerData = tenantData?.footer;

  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="footer-left">
          <div className="logo" style={{paddingTop: `${footerData?.logoPaddingTop || 0}px`}}>
            {LogoInFooter(tenant, footerData)}
          </div>
          {footerData?.copyright ? (
              <p className="copyright">
                ©{(new Date).getFullYear()} {footerData?.copyright}
              </p>
          ) : null}
          {footerData?.address ? <p className="address">{footerData?.address}</p> : null}
        </div>
        <div className="footer-right">
          <ul className="footer-links">
            {tenantData?.email ? <li><a className='is-footer-link' href={`mailto:${tenantData?.email}`}>{tenantData?.email}</a></li> : null}
            <li><Link className='is-footer-link' href={Routes.PrivacyPolicy}>Privacy Policy</Link></li>
            <li><Link className='is-footer-link' href={Routes.CookiePolicy}>Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default memo(Footer);
